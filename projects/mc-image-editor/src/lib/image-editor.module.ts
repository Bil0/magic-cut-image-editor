import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileReaderComponent } from './file-reader/file-reader.component';


@NgModule({
  imports: [
    CommonModule,
  ],
	declarations: [
    FileReaderComponent,
  ],
	exports: [
    FileReaderComponent,
  ],
})
export class ImageEditorModule { }
