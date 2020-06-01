import { Injectable } from '@angular/core';

import { FeatureContainer, ImageEditorFeature } from '../models/image-editor-feature.model';
import { ImageCropperService } from './crop-feature.service';

@Injectable({
    providedIn: 'root'
})
export class AvailableFeatures implements FeatureContainer {
	[props: string]: ImageEditorFeature;

	constructor(
		public imageCropper: ImageCropperService
	) {}
}
