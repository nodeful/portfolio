import { trigger, style, animate, transition } from '@angular/animations'

const DURATION = 100

const showStyle = {
  opacity: 1,
  transform: 'translate(0px, 0px)'
}

const hideStyle = {
  opacity: 0,
  transform: 'translate(0px, -20px)'
}
export const FadeFromTopAnimation = trigger('FadeFromTop', [
  transition(':enter', [   // :enter is alias to 'void => *'
    style(hideStyle),
    animate(DURATION, style(showStyle))
  ]),
  transition(':leave', [   // :leave is alias to '* => void'
    animate(DURATION, style(hideStyle))
  ])
])
