import { Component, OnInit, HostListener } from '@angular/core';

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
  styleUrls: ['./toolkit.component.scss']
})

export class ToolkitComponent implements OnInit {
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
        y: 18
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
        y: 56
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
        y: 203
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
        y: 32
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
        y: 246
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
        y: 234
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
        y: 156
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
        y: 252
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
        y: 266
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
        y: 81
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
        y: 277
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
        y: 282
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
        y: 80
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
        y: 61
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
        y: 48
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
        y: 280
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
        y: 224
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
        y: 100
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
        y: 48
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
        y: 80
      }
    }
  }]
  dragging = false
  draggingEl = null

  constructor() { }

  ngOnInit() {
  }

  mousedown (event) {
    this.dragging = true
    this.draggingEl = event.path[2]
  }

  @HostListener('mouseup')
  mouseup (event) {
    this.dragging = false
    this.draggingEl = null
  }

  mousemove (event) {
    event.preventDefault()
    if (this.dragging && this.draggingEl) {
      const parent = this.draggingEl.parentElement
      const parentCoords = parent.getBoundingClientRect()
      const coords = this.draggingEl.getBoundingClientRect()

      const y = coords.top - parentCoords.top
      const x = coords.left - parentCoords.left

      this.draggingEl.style.top = `${y + event.movementY}px`
      this.draggingEl.style.left = `${x + event.movementX}px`
    }
  }
}
