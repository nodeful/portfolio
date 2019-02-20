import { shell } from 'execa'
import * as path from 'path'
import BaseCI, { AllowedBranch } from './base'
import * as fs from 'fs-extra'
import * as utils from '@37x/node-utils'
import * as CloudFlare from 'cloudflare'

interface DockerOptions {
  keepDockerImageHistory?: boolean
  pushToBothRegistries?: boolean
  dockerArgs?: {
    [key in string]: string
  }
}

interface Docker extends DockerOptions {
  type: 'Docker'
}

type NodePackageManager = 'npm' | 'yarn'

interface Node extends DockerOptions {
  type: 'Node'
  packageManager?: NodePackageManager
  buildCommand?: string
}

interface Ruby extends DockerOptions {
  type: 'Ruby'
}

type Platform = Docker | Node | Ruby

interface GoogleCloudStorageHosting {
  type: 'Google Cloud Storage'
  domain: string
}

export interface KubernetesHosting {
  type: 'Kubernetes'
  namespace?: string
  name?: string
  deployment: {
    port?: number
    probe?: {
      path: string
      port: number
    }
    cpu: {
      request: string
      limit: string
    }
    ram: {
      request: string
      limit: string
    }
    autoscaler: {
      cpuThreshold: number
      minReplicas: number
      maxReplicas: number
    }
  }
  service?: {
    port: number
    targetPort: number
    public: boolean
    domain?: string
    https?: boolean
  }
}

type Hosting = GoogleCloudStorageHosting | KubernetesHosting
interface CIConfig {
  name: string
  platform: Platform
  branches?: AllowedBranch[]
  install?: boolean
  lint?: boolean
  test?: boolean
  build?: boolean
  afterBuildCommands?: string[]
  hosting?: Hosting
}

export default class ProjectCI {
  config: CIConfig

  constructor (config: CIConfig) {
    this.config = config
  }

  async run () {
    await this.install()
    await this.lint()
    await this.test()
    await this.build()
    await this.push()
    await this.deploy()
  }

  async install () {
    if (this.config.install) {
      switch (this.config.platform.type) {
        case 'Node': {
          if (process.env.CI_JOB_TOKEN) {
            // Replace gitlab url refs with an URL with an Auth Token
            this.replaceFileText(`${this.path}/package.json`, 'gitlab.com', `gitlab-ci-token:${process.env.CI_JOB_TOKEN}@gitlab.com`)
            const packageLockPath = `${this.path}/package-lock.json`
            if (fs.existsSync(packageLockPath)) {
              // Replace old tokens with original gitlab url
              this.replaceFileText(packageLockPath, 'gitlab-ci-token:.*@gitlab.com', 'gitlab.com')
              this.replaceFileText(packageLockPath, 'gitlab.com', `gitlab-ci-token:${process.env.CI_JOB_TOKEN}@gitlab.com`)
            }
          }
          await this.sh(`${this.npm} install ${this.npm === 'npm' ? '--only=development' : '--production=false'}`)
          break
        }
        case 'Ruby': {
          await this.sh('bundle install --path vendor/bundle')
          break
        }
      }
    }
  }

  async lint () {
    if (this.config.lint) {
      switch (this.config.platform.type) {
        case 'Node': await this.sh(`${this.npm} run lint`)
      }
    }
  }

  async test () {
    if (this.config.test) {
      switch (this.config.platform.type) {
        case 'Node': {
          await this.sh(`${this.npm} run test`)
          break
        }
      }
    }
  }

  async build () {
    if (this.config.build) {
      switch (this.config.platform.type) {
        case 'Node': {
          const { buildCommand } = this.config.platform
          await this.sh(`${this.npm} run ${buildCommand || 'build'}`)
          break
        }
        case 'Ruby': {
          await this.sh('bundle exec middleman build --clean')
          break
        }
      }
    }

    if (this.config.afterBuildCommands) {
      for (const command of this.config.afterBuildCommands) {
        await this.sh(command)
      }
    }

    if (this.shouldBuildDockerImage) {
      await this.buildDockerImage()
    }
  }

  protected async buildDockerImage () {
    await this.sh(`docker pull ${this.containerNames[0]}:latest || true`)
    await this.sh(`docker build\
    --cache-from ${this.containerNames[0]}:latest\
    ${this.containerNames.map(name => `-t ${name}:latest`).join(' ')}\
    ${this.shouldKeepDockerImageHistory ? this.containerNames.map(name => `-t ${name}:${this.buildId}`).join(' ') : ''}\
    ${this.config.platform.dockerArgs ? Object.entries(this.config.platform.dockerArgs).map(([ key, value ]) => ` --build-arg ${key}=${value} `).join(' ') : ''}\
    .`.replace(/\s\s+/g, ' '))
  }

  async push () {
    if (this.shouldBuildDockerImage) {
      await Promise.all(this.containerNames.map(container => this.sh(`docker push ${container}:latest`)))
      if (this.shouldKeepDockerImageHistory) {
        await Promise.all(this.containerNames.map(container => this.sh(`docker push ${container}:${this.buildId}`)))
      }
    }
  }

  async deploy () {
    if (this.config.hosting) {
      switch (this.config.hosting.type) {
        case 'Google Cloud Storage': {
          const { domain } = this.config.hosting
          // Upload all file from dist to the bucket
          await this.sh(`gsutil -m cp -z js,css,html -r dist/* gs://${domain}`)
          // Set charset to utf-8 to prevent encoding issues
          await this.sh(`gsutil -m setmeta -h "Content-Type:text/html;charset=utf-8" gs://${domain}/**/*.html`)
          // Make all files public
          this.sh(`gsutil iam ch allUsers:objectViewer gs://${domain}`).catch(console.error)
          await utils.time.delay(1000)
          await this.purge([
            `http://${domain}`,
            `https://${domain}`
          ])

          break
        }
        case 'Kubernetes': {
          await fs.copy('./kubernetes/templates/', `${this.path}/.kube/`)
          const kubeConfig = this.config.hosting
          const { deployment, service } = kubeConfig
          let replacements: any = {
            '{{NAMESPACE}}': kubeConfig.namespace || this.config.name,
            '{{NAME}}': kubeConfig.name || this.config.name,
            '{{CPU}}': deployment.cpu.request,
            '{{RAM}}': deployment.ram.request,
            '{{CPU_LIMIT}}': deployment.cpu.limit,
            '{{RAM_LIMIT}}': deployment.ram.limit,
            '{{IMAGE_TAG}}': this.buildId,
            '{{MIN_REPLICAS}}': deployment.autoscaler.minReplicas,
            '{{MAX_REPLICAS}}': deployment.autoscaler.maxReplicas,
            '{{CPU_SCALE_THRESHOLD}}': deployment.autoscaler.cpuThreshold
          }
          if (deployment.port) {
            fs.appendFile(`${this.path}/.kube/deployment.yaml`, `
        ports:
          - containerPort: ${deployment.port}`)
          }
          if (deployment.probe) {
            fs.appendFile(`${this.path}/.kube/deployment.yaml`, `
        readinessProbe:
          httpGet:
              path: ${deployment.probe.path}
              port: ${deployment.probe.port}
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
              path: ${deployment.probe.path}
              port: ${deployment.probe.port}
          initialDelaySeconds: 15
          periodSeconds: 20
            `)
          }
          if (service) {
            replacements = {
              ...replacements,
              '{{SERVICE_TYPE}}': service.public ? (service.https ? 'NodePort' : 'LoadBalancer') : 'NodePort',
              '{{SERVICE_PORT}}': service.port,
              '{{TARGET_PORT}}': service.targetPort,
              '{{DOMAIN}}': 'api.37x.com'
            }
            if (service.public && service.https) {
              replacements['{{DOMAIN}}'] = service.domain || `${(kubeConfig.name || this.config.name)}.37x.com`
            }
          }

          await Promise.all(this.kubernetesConfigFiles.map(file => {
            for (const [from, to] of Object.entries(replacements)) {
              this.replaceFileText(`${this.path}/.kube/${file}`, from, to.toString())
            }
          }))
          await this.sh(`kubectl apply -f .kube/namespace.yaml`)
          await this.sh(`kubectl apply -f .kube/deployment.yaml`)
          await this.sh(`kubectl apply -f .kube/autoscaler.yaml --validate=false`)
          if (service) {
            await this.sh(`kubectl apply -f .kube/service.yaml`)
            if (service.public && service.https) {
              await this.sh(`kubectl apply -f .kube/ingress-tls.yaml`)
            }
          }
        }
      }
    }
  }

  protected purge (domain: string | string[]) {
    const cf = CloudFlare({
      email: 'hosting@30m.com',
      key: process.env.CLOUDFLARE_API_KEY
    })

    return cf.zones.purgeCache('c52fc65643f51551debfc288c570bd09', {
      files: typeof domain === 'string' ? [ domain ] : domain
    })
  }

  protected replaceFileText (path: string, from: string, to: string) {
    const text = fs.readFileSync(path).toString()
    fs.writeFileSync(path, text.replace(new RegExp(from, 'gm'), to))
  }

  protected get kubernetesConfigFiles (): string[] {
    return fs.readdirSync(`${this.path}/.kube/`)
  }

  protected get containerNames (): string[] {
    const name = (() => {
      if (this.config.hosting && this.config.hosting.type === 'Kubernetes') {
        return this.config.hosting.name || this.config.name
      }
      return this.config.name
    })()
    return this.registries.map(registry => `${registry}/${name}`)
  }

  protected get registries (): string[] {
    const gcpRegistry = 'us.gcr.io/thirtysevenx-production'
    const gitlabRegistry = 'registry.gitlab.com/37x/37x'
    if (this.config.platform.pushToBothRegistries) {
      return [gcpRegistry, gitlabRegistry]
    }
    if (this.shouldHost && this.config.hosting.type === 'Kubernetes') {
      return [gcpRegistry]
    } else {
      return [gitlabRegistry]
    }
  }

  protected async sh (command: string) {
    const { stdout } = await shell('id -u $(whoami)')
    const uid = parseInt(stdout)
    return shell(command, {
      cwd: path.join(process.cwd(), this.path),
      stdout: process.stdout,
      uid
    })
  }

  get path (): string {
    return BaseCI.getPath(this.config.name)
  }

  get commitHash () {
    return process.env.CI_COMMIT_SHA
  }

  get buildId () {
    return this.commitHash.substr(0, 8)
  }

  get shouldHost () {
    return !!this.config.hosting
  }

  get shouldBuildDockerImage (): boolean {
    return this.config.platform.type === 'Docker' || (this.shouldHost && this.config.hosting.type === 'Kubernetes')
  }

  get shouldKeepDockerImageHistory (): boolean {
    const { keepDockerImageHistory } = this.config.platform
    return this.shouldBuildDockerImage && keepDockerImageHistory !== false
  }

  get npm (): NodePackageManager {
    return (this.config.platform as Node).packageManager || 'npm'
  }
}
