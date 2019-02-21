import { Component } from '@angular/core'

@Component({
  selector: 'links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent {
  links = [{
    name: 'LinkedIn',
    icon: 'linkedin.svg',
    action: () => this.openUrl('https://linkedin.com/in/romankisil')
  }, {
    name: 'GitHub',
    icon: 'github.png',
    action: () => this.openUrl('https://github.com/nodeful')
  }, {
    name: 'CV',
    icon: 'download.svg',
    download: 'assets/cv.pdf'
  }]

  openUrl (url: string) {
    window.open(url, '_blank')
  }

  downloadFile (url: string) {
    window.document.getElementById('download_iframe')['src'] = url
  }

}
