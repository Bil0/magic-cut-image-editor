import { Injectable } from '@angular/core';

import { ImageEditorFeature } from '../models/image-editor-feature.model';

@Injectable({
  providedIn: 'root',
})
export class ImageCropperService implements ImageEditorFeature {
  name = 'crop';
  apply(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
}
