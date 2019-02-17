import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component'
import { BubbleComponent } from './components/bubble/bubble.component'
import { ProfileComponent } from './sections/profile/profile.component'
import { ToolkitComponent } from './sections/toolkit/toolkit.component'
import { HeaderComponent } from './sections/header/header.component'
import { FooterComponent } from './sections/footer/footer.component'
import { PropagationAnimationComponent } from './sections/propagation-animation/propagation-animation.component'
import { CraftsComponent } from './sections/crafts/crafts.component'
import { GaugeComponent } from './components/gauge/gauge.component'
import { NgxGaugeModule } from 'ngx-gauge'
import { SafePipe } from './pipes/safe.pipe'

@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    ProfileComponent,
    ToolkitComponent,
    HeaderComponent,
    FooterComponent,
    PropagationAnimationComponent,
    CraftsComponent,
    GaugeComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    NgxGaugeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
