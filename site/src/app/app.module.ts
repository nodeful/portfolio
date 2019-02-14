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

@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    ProfileComponent,
    ToolkitComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
