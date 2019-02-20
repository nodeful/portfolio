import { config } from 'dotenv'
config()

import CI from './project'

const DEPLOY_ARGUMENT = '--deploy='
export type AllowedBranch = 'master' | 'development'

const env = (key: string): string | undefined => process.env[key]
export default class BaseCI {
  static async run () {
    let log = ''
    if (this.deployRequested) {
      log += `Deployments Requested:\n`
      try {
        let CIs = this.deployments
          .map<CI>(this.getDeploymentCI.bind(this))
          .filter(ci => {
            log += `\n\`${ci.config.name}\``
            if (ci.config.branches) {
              if (ci.config.branches.includes(this.branch as AllowedBranch)) return true
              log = log.replace(`\`${ci.config.name}\``, `~\`${ci.config.name}\`~`)
              log += ` - will not deploy as current branch \`${this.branch}\` is not any of: \`${ci.config.branches.join('`, `')}\``
              return false
            } else {
              if (this.isMaster) return true
              log = log.replace(`\`${ci.config.name}\``, `~\`${ci.config.name}\`~`)
              log += ` - will not deploy as current branch \`${this.branch}\` is not master`
              return false
            }
          })

        await Promise.all(CIs.map(ci => ci.install()))
        await Promise.all(CIs.map(ci => ci.lint()))
        await Promise.all(CIs.map(ci => ci.test()))
        await Promise.all(CIs.map(ci => ci.build()))
        await Promise.all(CIs.map(ci => ci.push()))
        await Promise.all(CIs.map(ci => ci.deploy()))
        if (CIs.length) log += `\nSuccess! :tada: \nDeployed: ${CIs.map(ci => ci.config.name).join(', ')}`
      } catch (err) {
        console.error(err)
        log += this.escapeTemplateString('\nFailed due to: \n```\n' + err + '\n```')
        await this.log(log)
        process.exit(1)
      }
    } else {
      log += `Push to Branch \`${this.branch}\` but no deployment requested.`
    }
    await this.log(log)
  }

  static getDeploymentCI (deployment: string): CI {
    const path = this.getPath(deployment)
    return require(process.cwd() + `/${path}/ci`).default
  }

  static get deployRequested (): boolean {
    return !!this.commitMessage && new RegExp(DEPLOY_ARGUMENT).test(this.commitMessage)
  }

  static get commitMessage () {
    return env('CI_COMMIT_MESSAGE')
  }

  static get commitHash () {
    return env('CI_COMMIT_SHA')
  }

  static get buildId () {
    return this.commitHash.substr(0, 8)
  }

  static get deployments (): string[] {
    return this.commitMessage.split(DEPLOY_ARGUMENT)[1].split(',').map(deploy => deploy.replace(' ', '').replace(/(\r\n\t|\n|\r\t)/gm, ''))
  }

  static log (message: string) {
    return Logger.slack('37x-ci', `
Branch: \`${this.branch}\`
Commit: <https://gitlab.com/37x/37x/commit/${this.commitHash}|${this.buildId}>
Message: ${this.commitMessage}
<https://gitlab.com/37x/37x/-/jobs/${this.jobId}|CI Log>
${message}`, 'GitLab CI')
  }

  static getPath (deployment: string): string {
    const { ciPaths } = require('../../package.json')
    if (!ciPaths.hasOwnProperty(deployment)) {
      throw new Error(`CI Path not found for "${deployment}". Please provide a path in "ciPaths" in the package.json`)
    }
    return ciPaths[deployment]
  }

  static get branch () {
    return env('CI_COMMIT_REF_NAME')
  }
  static get isMaster () {
    return this.branch === 'master'
  }

  static get jobId () {
    return env('CI_JOB_ID')
  }

  static escapeTemplateString (str: string) {
    return str.replace(/`/g, '\`')
  }
}

(async () => { await BaseCI.run() })()
