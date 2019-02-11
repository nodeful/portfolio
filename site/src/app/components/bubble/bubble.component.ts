import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core';

@Component({
  selector: 'bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  @Input() name = 'placeholder'
  @Input() ext = 'jpg'
  @HostBinding('style.background-color') color = '#fff'
  @HostBinding('style.width.px') size = 100

  constructor(private elRef: ElementRef) { }

  ngOnInit() {
    this.elRef.nativeElement.style.height = `${this.size}px`
  }

}
