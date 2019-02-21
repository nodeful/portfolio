import { Injectable } from '@angular/core'

interface RGBColor {
  r: number
  g: number
  b: number
}

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  delay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  hexColorToRGB (hex: string): RGBColor {
    hex = hex.replace('#', '')
    const [ r, g, b ] = hex.match(/.{2}/g)
    return {
      r: this.hexToInt(r),
      g: this.hexToInt(g),
      b: this.hexToInt(b)
    }
  }

  hexToInt (hex: string): number {
    return parseInt(`0x${hex}`)
  }

  rgbToHexColor (color: RGBColor): string {
    const { r, g, b } = color
    return `#${this.intToHex(r)}${this.intToHex(g)}${this.intToHex(b)}`
  }

  intToHex (int: number, padding: number = 2): string {
    let hex = int.toString(16)
    while (hex.length < padding) {
      hex = '0' + hex
    }
    return hex
  }
  mapValue (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  }
}
