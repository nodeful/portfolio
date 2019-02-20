import { Component, OnInit, Input, HostBinding, ElementRef } from '@angular/core'

@Component({
  selector: 'bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  @Input() name = 'placeholder'
  @Input() ext = 'jpg'
  private _color = '#fff'
  @Input()
  set color (newColor) {
    this._color = newColor
    this.setStyle()
  }
  get color () { return this._color }

  private _size = 100
  @Input()
  set size (newSize) {
    this._size = newSize
    this.setStyle()
  }
  get size () { return this._size }

  @Input() scale = 1

  constructor (private elRef: ElementRef) { }

  ngOnInit () {
    this.setStyle()
  }

  setStyle () {
    const el = this.elRef.nativeElement
    el.style['background-color'] = this.color
    el.style.height = `${this.size}px`
    el.style.width = `${this.size}px`
  }
}
