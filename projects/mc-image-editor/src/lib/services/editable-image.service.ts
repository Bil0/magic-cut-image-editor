import { ReplaySubject, Observable, fromEvent } from 'rxjs';

import {
  ImageEditorFeature,
  CustomImageEditorFeature,
} from '../models/image-editor-feature.model';

export class EditableImageService {
  public context: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public image: HTMLImageElement = new Image();

  protected dataURL: string;
  protected blob: Blob;
  protected imageLoaded: ReplaySubject<any> = new ReplaySubject<any>();
  protected name: string;

  constructor(
    data: Blob | File,
    protected editor: { [feature: string]: ImageEditorFeature }
  ) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    const reader = new FileReader();
    if (data instanceof File) {
      this.name = data.name;
    }

    fromEvent(reader, 'load').subscribe((e: Event) => {
      this.image.src = (e.target as FileReader).result as string;
    });

    fromEvent(this.image, 'load').subscribe((e: Event) => {
      this.imageLoaded.next(e);
    });

    reader.readAsDataURL(data);
  }

  get ready(): Observable<any> {
    return this.imageLoaded.asObservable();
  }

  apply(feature: string, ...args: Array<any>): EditableImageService {
    this.ready.subscribe(() => {
      this.editor[feature].apply(this.context, this.image, ...args);
    });
    return this;
  }

  applyCustom(fn: CustomImageEditorFeature) {
    this.ready.subscribe(() => {
      fn(this.context, this.image);
    });
    return this;
  }

  getDataURL(type: string = 'image/png', quality: number = 0.92): string {
    this.dataURL = this.canvas.toDataURL(type, quality);
    return this.dataURL;
  }

  getBlob(type: string = 'image/png', quality: number = 0.92): Blob {
    const base64 = this.canvas.toDataURL(type, quality);
    const binStr = atob(base64.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    this.blob = new Blob([arr], { type });
    (this.blob as any).hasDataURL = true;
    (this.blob as any).toJSON = function () {
      return {
        name: this.name,
        size: this.size,
        type: this.type,
        dataURL: base64,
      };
    };
    this.blob.toString = (this.blob as any).toJSON;
    return this.blob;
  }
}
