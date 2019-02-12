import { Component, OnInit } from '@angular/core';

interface Tool {
  name: string
  icon: Icon
}

interface Icon {
  name: string
  ext: string
  color: string
  size: 1 | 2 | 3 | 4 | 5
  scale?: number
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
      scale: 80
    }
  }, {
    name: 'TypeScript',
    icon: {
      name: 'typescript',
      ext: 'png',
      color: '#0079CF',
      size: 5,
      scale: 80
    }
  }, {
    name: 'JavaScript',
    icon: {
      name: 'javascript',
      ext: 'jpg',
      color: '#F0DD3E',
      size: 5,
      scale: 80
    }
  }, {
    name: 'Docker',
    icon: {
      name: 'docker',
      ext: 'svg',
      color: '#44A1F0',
      size: 4,
      scale: 80
    }
  }, {
    name: 'Kubernetes',
    icon: {
      name: 'kubernetes',
      ext: 'png',
      color: '#326DE6',
      size: 4
    }
  }, {
    name: 'Angular',
    icon: {
      name: 'angular',
      ext: 'png',
      color: '#206BC1',
      size: 4
    }
  }, {
    name: 'Google Cloud',
    icon: {
      name: 'googlecloud',
      ext: 'png',
      color: '#F6F6F6',
      size: 3,
      scale: 80
    }
  }, {
    name: 'Ionic',
    icon: {
      name: 'ionic',
      ext: 'png',
      color: '#fff',
      size: 3
    }
  }, {
    name: 'Electron',
    icon: {
      name: 'electron',
      ext: 'png',
      color: '#fff',
      size: 3
    }
  }, {
    name: 'mongoDB',
    icon: {
      name: 'mongodb',
      ext: 'jpg',
      color: '#fff',
      size: 2,
      scale: 100
    }
  }, {
    name: 'PostgreSQL',
    icon: {
      name: 'postgresql',
      ext: 'png',
      color: '#fff',
      size: 2,
      scale: 75
    }
  }, {
    name: 'Redis',
    icon: {
      name: 'redis',
      ext: 'png',
      color: '#222222',
      size: 2,
      scale: 80
    }
  }, {
    name: 'TimescaleDB',
    icon: {
      name: 'timescaledb',
      ext: 'jpg',
      color: '#fff',
      size: 2
    }
  }, {
    name: 'Swift',
    icon: {
      name: 'swift',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: 70
    }
  }, {
    name: 'GitLab',
    icon: {
      name: 'gitlab',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: 80
    }
  }, {
    name: 'GitHub',
    icon: {
      name: 'github',
      ext: 'png',
      color: '#fff',
      size: 3
    }
  }, {
    name: 'VSCode',
    icon: {
      name: 'vscode',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: 80
    }
  }, {
    name: 'StandardJS',
    icon: {
      name: 'standard',
      ext: 'svg',
      color: '#F0DD3E',
      size: 2
    }
  }, {
    name: 'DigitalOcean',
    icon: {
      name: 'digitalocean',
      ext: 'png',
      color: '#fff',
      size: 3,
      scale: 80
    }
  }, {
    name: 'Cloudflare',
    icon: {
      name: 'cloudflare',
      ext: 'png',
      color: '#FFFFFF',
      size: 3,
      scale: 80
    }
  }]

  constructor() { }

  ngOnInit() {
  }

}
