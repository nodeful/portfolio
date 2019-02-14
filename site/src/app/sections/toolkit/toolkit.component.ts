import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core'
import { UtilitiesService } from '../../services/utilities.service'
import { FadeFromTopAnimation } from '../../animations/fade-from-top'

interface Tool {
  name: string
  icon: Icon
}

interface Icon {
  name: string
  ext: string
  color: string
  size: 1 | 2 | 3 | 4 | 5
  scale?: number,
  position: {
    x: number
    y: number
  }
}
@Component({
  selector: 'toolkit',
  templateUrl: './toolkit.component.html',
  styleUrls: ['./toolkit.component.scss'],
  animations: [FadeFromTopAnimation]
})

export class ToolkitComponent implements OnInit, OnDestroy {
  tools: Tool[] = [{
    name: 'Node.js',
    icon: {
      name: 'node',
      ext: 'png',
      color: '#333333',
      size: 5,
      scale: .8,
      position: {
        x: 226,
        y: -2
      }
    }
  }, {
    name: 'TypeScript',
    icon: {
      name: 'typescript',
      ext: 'png',
      color: '#0079CF',
      size: 5,
      scale: .8,
      position: {
        x: 1240,
        y: 36
      }
    }
  }, {
    name: 'JavaScript',
    icon: {
      name: 'javascript',
      ext: 'jpg',
      color: '#F0DD3E',
      size: 5,
      scale: .8,
      position: {
        x: 2527,
        y: 183
      }
    }
  }, {
    name: 'Docker',
    icon: {
      name: 'docker',
      ext: 'svg',
      color: '#44A1F0',
      size: 4,
      scale: .8,
      position: {
        x: 2298,
        y: 12
      }
    }
  }, {
    name: 'Kubernetes',
    icon: {
      name: 'kubernetes',
      ext: 'png',
      color: '#326DE6',
      size: 4,
      position: {
        x: 1917,
        y: 226
      }
    }
  }, {
    name: 'Angular',
    icon: {
      name: 'angular',
      ext: 'png',
      color: '#206BC1',
      size: 4,
      position: {
        x: 672,
        y: 214
      }
    }
  }, {
    name: 'Google Cloud',
    icon: {
      name: 'googlecloud',
      ext: 'png',
      color: '#F6F6F6',
      size: 3,
      scale: .8,
      position: {
        x: 1709,
        y: 136
      }
    }
  }, {
    name: 'Ionic',
    icon: {
      name: 'ionic',
      ext: 'png',
      color: '#fff',
      size: 3,
      position: {
        x: 997,
        y: 232
      }
    }
  }, {
    name: 'Electron',
    icon: {
      name: 'electron',
      ext: 'png',
      color: '#fff',
      size: 3,
      position: {
        x: 1499,
        y: 246
      }
    }
  }, {
    name: 'mongoDB',
    icon: {
      name: 'mongodb',
      ext: 'jpg',
      color: '#fff',
      size: 2,
      position: {
        x: 2517,
        y: 61
      }
    }
  }, {
    name: 'PostgreSQL',
    icon: {
      name: 'postgresql',
      ext: 'png',
      color: '#fff',
      size: 2,
      scale: .75,
      position: {
        x: 143,
        y: 257
      }
    }
  }, {
    name: 'Redis',
    icon: {
      name: 'redis',
      ext: 'png',
      color: '#222222',
      size: 2,
      scale: .8,
      position: {
        x: 1230,
        y: 262
      }
    }
  }, {
    name: 'TimescaleDB',
    icon: {
      name: 'timescaledb',
      ext: 'jpg',
      color: '#fff',
      size: 2,
      position: {
        x: 1516,
        y: 60
      }
    }
  }, {
    name: 'Swift',
    icon: {
      name: 'swift',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: .7,
      position: {
        x: 2004,
        y: 41
      }
    }
  }, {
    name: 'GitLab',
    icon: {
      name: 'gitlab',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: .8,
      position: {
        x: 780,
        y: 28
      }
    }
  }, {
    name: 'GitHub',
    icon: {
      name: 'github',
      ext: 'png',
      color: '#fff',
      size: 3,
      position: {
        x: 2294,
        y: 260
      }
    }
  }, {
    name: 'VSCode',
    icon: {
      name: 'vscode',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: .8,
      position: {
        x: 389,
        y: 204
      }
    }
  }, {
    name: 'StandardJS',
    icon: {
      name: 'standard',
      ext: 'svg',
      color: '#F0DD3E',
      size: 2,
      position: {
        x: 1027,
        y: 80
      }
    }
  }, {
    name: 'DigitalOcean',
    icon: {
      name: 'digitalocean',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: .8,
      position: {
        x: 522,
        y: 28
      }
    }
  }, {
    name: 'Cloudflare',
    icon: {
      name: 'cloudflare',
      ext: 'png',
      color: '#FFFFFF',
      size: 3,
      scale: .8,
      position: {
        x: 35,
        y: 60
      }
    }
  }]
  @ViewChild('pages') pagesRef

  iconPadding = 20
  minPageWidth = 900
  animationId = null

  constructor (private utils: UtilitiesService) {
    this.rescale()
  }

  rescale () {
    const furthestTool = this.tools.reduce(function (prev, current) {
      return (prev.icon.position.x > current.icon.position.x) ? prev : current
    })
    const originalWidth = furthestTool.icon.position.x + this.getToolIconSize(furthestTool)
    const ratio = this.pageWidth / originalWidth

    for (const tool of this.tools) {
      tool.icon.position.x *= ratio
      tool.icon.position.y *= ratio
      tool.icon.size *= ratio
    }
  }

  async ngOnInit () {
    await this.setup()
    this.update()
  }

  async setup () {
    let i = -1
    while (this.pages.length !== 2) {
      await this.utils.delay(10)
    }
    for (const page of this.pages) {
      i++
      page.style.transform = `translate(${i * this.pageWidth}px, 0px)`
    }
  }

  update () {
    const SCROLL_SPEED = .3 // Pixels to move per frame. At 60fps, this would be 18px a sec.
    for (const page of this.pages) {
      let { x } = page.getBoundingClientRect()
      x -= SCROLL_SPEED
      if (x < -this.pageWidth) {
        x = this.pageWidth
      }
      page.style.transform = `translate(${x}px, 0px)`
    // Queue up another update() method call on the next frame
    }
    this.animationId = requestAnimationFrame(this.update.bind(this))
  }

  getToolIconSize (tool: Tool) {
    return 100 * tool.icon.size / 3
  }

  get pageWidth () {
    let width = window.innerWidth
    if (width < this.minPageWidth) {
      width = this.minPageWidth
    }
    return width
  }

  get pages () {
    const pagesEl = this.pagesRef.nativeElement
    const pagesElements = pagesEl.children
    return pagesElements
  }

  ngOnDestroy () {
    if (this.animationId) cancelAnimationFrame(this.animationId)
  }
}
