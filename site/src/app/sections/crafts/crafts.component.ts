import { Component, OnInit, ChangeDetectorRef, HostListener, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core'
import { UtilitiesService } from '../../services/utilities.service'
import { Color, ColorSolver } from '../../services/color.service'

type Bracket = 'Novice' | 'Intermediate' | 'Advanced' | 'Skilled' | 'Expert'

interface BracketConfig {
  bracket: Bracket
  startColor: string
  endColor: string
  startMastery: number
  endMastery: number
}

@Component({
  selector: 'crafts',
  templateUrl: './crafts.component.html',
  styleUrls: ['./crafts.component.scss']
})
export class CraftsComponent implements OnInit, OnDestroy {

  crafts = [
    {
      name: 'Design',
      mastery: 0.1
    },
    {
      name: 'Front-end (Mobile & Web)',
      mastery: 0.4
    },
    {
      name: 'API\'s',
      mastery: 0.9
    },
    {
      name: 'CI/CD',
      mastery: 1
    },
    {
      name: 'DevOps',
      mastery: 0.6
    },
    {
      name: 'Databases',
      mastery: 0.5
    },
    {
      name: 'Project Management',
      mastery: 0.5
    },
    {
      name: 'System Architecture',
      mastery: 0.7
    },
    {
      name: 'Security',
      mastery: .6
    }
  ].map(c => ({ ...c, filter: 'none', value: 0 }))

  colors = {
    red: '#ed0022',
    orange: '#fc6114',
    yellow: '#edbd02',
    lightgreen: '#4aa84e',
    green: '#009a60'
  }

  filters: string[] = []

  bracketConfigs: BracketConfig[] = [{
    bracket: 'Novice',
    startColor: this.colors.red,
    endColor: this.colors.orange,
    startMastery: 0,
    endMastery: .2
  }, {
    bracket: 'Intermediate',
    startColor: this.colors.orange,
    endColor: this.colors.yellow,
    startMastery: .2,
    endMastery: .4
  }, {
    bracket: 'Advanced',
    startColor: this.colors.yellow,
    endColor: this.colors.yellow,
    startMastery: .4,
    endMastery: .6
  }, {
    bracket: 'Skilled',
    startColor: this.colors.yellow,
    endColor: this.colors.lightgreen,
    startMastery: .6,
    endMastery: .8
  }, {
    bracket: 'Expert',
    startColor: this.colors.lightgreen,
    endColor: this.colors.green,
    startMastery: .8,
    endMastery: 1
  }]

  filtersPregenerated = false
  updateInterval: NodeJS.Timer
  @ViewChildren('gauge') gauges: QueryList<any>

  constructor (private utils: UtilitiesService, private cdr: ChangeDetectorRef) {}

  @HostListener('window:scroll', ['$event'])
  scrollHandler () {
    this.update()
  }

  ngOnInit () {
    this.pregenerateFilters()
    this.update()
    this.updateInterval = setInterval(this.update.bind(this), 1000)
  }

  ngOnDestroy () {
    if (this.updateInterval) clearInterval(this.updateInterval)
  }

  pregenerateFilters () {
    let value = 0
    let index = 0
    const startedAt = new Date().getTime()
    while (index < 100) {
      const config = this.getBracketConfig(value)
      const startRGB = this.utils.hexColorToRGB(config.startColor)
      const endRGB = this.utils.hexColorToRGB(config.endColor)
      const bracketProgress = this.utils.mapValue(value, config.startMastery, config.endMastery, 0, 1)
      const { r, g ,b } = {
        r: Math.round(this.utils.mapValue(bracketProgress, 0, 1, startRGB.r, endRGB.r)),
        g: Math.round(this.utils.mapValue(bracketProgress, 0, 1, startRGB.g, endRGB.g)),
        b: Math.round(this.utils.mapValue(bracketProgress, 0, 1, startRGB.b, endRGB.b))
      }

      const color = new Color(r, g, b)
      const solver = new ColorSolver(color)
      const result = solver.solve()
      this.filters[index] = result.filter.replace('filter: ', '').replace(';', '')

      value += .01
      index++
    }
    console.log(`Took ${(new Date().getTime() - startedAt) / 1000} seconds to pregenerate filters`)
    this.filtersPregenerated = true
  }

  getBracket (mastery: number): Bracket {
    return this.getBracketConfig(mastery).bracket
  }

  getBracketConfig (mastery: number): BracketConfig {
    return this.bracketConfigs.find(config => config.startMastery <= mastery && mastery <= config.endMastery)
  }

  update () {
    if (!this.gauges) return
    let index = -1
    // console.log(this.gauges)
    for (const craft of this.crafts) {
      index++
      const el = this.gauges.toArray()[index]._elementRef.nativeElement
      const wH = window.innerHeight
      const { y, height } = el.getBoundingClientRect()
      let progress = this.utils.mapValue(y, wH, wH - height , 0, 1)
      if (progress > 1) progress = 1
      const craftProgress = craft.mastery * progress
      let filterIndex = Math.round(craftProgress * 100)
      if (filterIndex > this.filters.length - 1) filterIndex = this.filters.length - 1
      craft.filter = this.filters[filterIndex]
      craft.value = craftProgress
    }

    this.cdr.detectChanges()
  }

}
