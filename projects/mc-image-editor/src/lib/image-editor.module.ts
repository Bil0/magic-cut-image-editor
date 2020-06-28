import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileReaderComponent } from './components/file-reader/file-reader.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FileReaderComponent, ImageCropperComponent],
  exports: [FileReaderComponent, ImageCropperComponent],
})
export class ImageEditorModule {}
