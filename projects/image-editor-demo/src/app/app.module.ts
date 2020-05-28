import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ImageEditorModule } from 'mc-image-editor';

import { AppComponent } from './app.component';
import { FileReaderDemoComponent } from './file-reader-demo/file-reader-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    FileReaderDemoComponent,
  ],
  imports: [
    BrowserModule,
    ImageEditorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
