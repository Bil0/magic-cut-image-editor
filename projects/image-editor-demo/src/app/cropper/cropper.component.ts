import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { ImageCropperComponent } from 'mc-image-editor';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cropper-demo',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropperDemoComponent implements OnChanges, OnDestroy {
    config;
    url: string;
    @Input() file: File;
	@Input() cropWidth: number;
	@Input() cropHeight: number;
	@Output() croppImage = new EventEmitter();
    @ViewChild('cropper', { static: true }) cropper: ImageCropperComponent;


    subscriptions: Subscription[] = [];

	ngOnChanges() {
		this.cropper.initImageCrop(this.file);
		this.subscriptions.push(this.cropper.editable.ready.subscribe(r => {
			this.subscriptions.push(this.cropper.configChange.pipe(
				debounceTime(300),
			)
				.subscribe(res => {
					this.croppImage.emit(new File([ this.cropper.getBlob() ], this.file.name));
				}));
		}));
	}

	ngOnDestroy() {
		this.subscriptions.forEach(res => res.unsubscribe());
    }

    updateImageConfig(config) {
        this.config = config;
    }

    setUrl() {
		this.url = this.cropper.getDataURL();
	}
}

