import { Injectable } from '@angular/core';

import { ImageEditorFeature } from '../models/image-editor-feature.model';
import { AvailableFeatures } from './available-feature.service';
import { EditableImageService } from './editable-image.service';

@Injectable({
  providedIn: 'root',
})
export class ImageEditorService {
  features: { [feature: string]: ImageEditorFeature } = {};

  constructor(availableFeatures: AvailableFeatures) {
    for (const f in availableFeatures) {
      if (availableFeatures[f]) {
        this.registerFeature(availableFeatures[f]);
      }
    }
  }

  private registerFeature(feature: ImageEditorFeature) {
    if (
      this.features[feature.name] &&
      this.features[feature.name] === feature
    ) {
      throw new Error(`${feature.name} is already registered`);
    }
    this.features[feature.name] = feature;
  }

  edit(image: Blob | File) {
    return new EditableImageService(image, this.features);
  }
}
