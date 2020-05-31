import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';

import { ImageEditorModule } from 'mc-image-editor';

import { AppComponent } from './app.component';
import { CropperDemoComponent } from './cropper/cropper.component';

@NgModule({
  declarations: [
    AppComponent,
    CropperDemoComponent,
  ],
  imports: [
    BrowserModule,
    ImageEditorModule,
    MatCardModule,
    MatSliderModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
