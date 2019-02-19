import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  links = [{
    name: 'LinkedIn',
    icon: 'linkedin.svg'
  }, {
    name: 'GitHub',
    icon: 'github.png'
  }, {
    name: 'YouTube',
    icon: 'youtube.png'
  }, {
    name: 'LinkedIn',
    icon: 'linkedin.svg'
  }, {
    name: 'LinkedIn',
    icon: 'linkedin.svg'
  }]
}
