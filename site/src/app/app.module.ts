import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { BubbleComponent } from './components/bubble/bubble.component';
import { ProfileComponent } from './sections/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    BubbleComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
