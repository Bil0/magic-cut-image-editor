import {
	Component,
	Input,
	Output,
	ElementRef,
	HostListener,
	ViewChild,
	EventEmitter,
	ChangeDetectionStrategy
} from '@angular/core';
import * as _ from 'lodash';

import { ImageEditorService } from '../../services/image-editor.service';
import { EditableImageService } from '../../services/editable-image.service';

@Component({
	selector: 'mc-image-cropper',
	templateUrl: './image-cropper.component.html',
	styleUrls: ['./image-cropper.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropperComponent {
	private borders: { vborder: number, hborder: number };
	private moveDelta: { x: number, y: number };
	private imagePosition: { x: number, y: number } = { x: 0, y: 0 };
	private originalImageDimensions: Dimension = { width: 0, height: 0 };
	private imageDimensions: Dimension = { width: 0, height: 0 };
	private cropDimensions: Dimension;
	private eventListeners: { mousemove: EventListener, mouseup: EventListener };

	editable: EditableImageService;
	zoomConfig = { value: 1, max: 4 };
	img: Blob;

	@Output() configChange = new EventEmitter();
	@Input('src') set image(value: Blob) { this.initImageCrop(value); }

	@Input() cropWidth: number;
	@Input() cropHeight: number;

	@Input() set zoom(value: any) {
		this.editable.ready.subscribe(() => {
			this.setZoom(value);
		});
	}
	get zoom() { return this.zoomConfig.value; }

	@Input() set top(value: any) {
		this.editable.ready.subscribe(() => {
			this.imagePosition.y = 0;
			this.moveDelta = { y: 0, x: this.imagePosition.x};
			this.move({ clientY: parseInt(value, 10), clientX: this.imagePosition.x } as MouseEvent);
			delete this.moveDelta;
		});
	}
	get top() { return this.imagePosition.y; }

	@Input() set left(value: any) {
		this.editable.ready.subscribe(() => {
			this.imagePosition.x = 0;
			this.moveDelta = { x: 0, y: this.imagePosition.y};
			this.move({ clientX: parseInt(value, 10), clientY: this.imagePosition.y } as MouseEvent);
			delete this.moveDelta;
		});
	}
	get left() { return this.imagePosition.x; }

	@Input() set maxZoom(value: any) { this.zoomConfig.max = parseFloat(value); }
	get maxZoom() { return this.zoomConfig.max; }

	@ViewChild('previewImage') previewImage: ElementRef;

	@HostListener('mousedown') public triggerMove() {
		window.addEventListener('mousemove', this.eventListeners.mousemove, false);
		window.addEventListener('mouseup', this.eventListeners.mouseup, false);
		return false;
	}

	constructor(private editor: ImageEditorService, private el: ElementRef) { }

	initImageCrop(image: Blob) {
		this.editable = this.editor.edit(image);
		this.editable.ready.subscribe(() => {
			const previewDimensions = this.getComputedDimensions(this.el.nativeElement);
			const fittingDimensions = this.fitArea(
				{ width: this.cropWidth, height: this.cropHeight },
				{ width: previewDimensions.width, height: previewDimensions.height }
			);

			const { vborder, hborder } = this.addTransparentBorder(previewDimensions, fittingDimensions);
			this.borders = { vborder, hborder };

			const fillingDimensions = this.fillArea(
				{ width: this.editable.image.width, height: this.editable.image.height },
				{ width: fittingDimensions.width, height: fittingDimensions.height }
			);

			this.editable.canvas.width = this.cropWidth;
			this.editable.canvas.height = this.cropHeight;

			this.previewImage.nativeElement.src = this.editable.image.src;
			const img = this.previewImage.nativeElement;

			img.style.left = (hborder + (fittingDimensions.width - fillingDimensions.width) / 2) + 'px';
			img.style.top = (vborder + (fittingDimensions.height - fillingDimensions.height) / 2) + 'px';
			img.style.width = fillingDimensions.width + 'px';
			img.style.height = fillingDimensions.height + 'px';

			this.originalImageDimensions = fillingDimensions;

			this.imageDimensions.width = fillingDimensions.width;
			this.imageDimensions.height = fillingDimensions.height;

			this.cropDimensions = fittingDimensions;

			this.imagePosition = {
				x: hborder + (fittingDimensions.width - fillingDimensions.width) / 2,
				y: vborder + (fittingDimensions.height - fillingDimensions.height) / 2
			};
		});

		this.eventListeners = { mousemove: this.move.bind(this), mouseup: this.stopMove.bind(this) };
	}

	public move(e: MouseEvent) {
		if (!this.moveDelta) { this.moveDelta = { x: e.clientX, y: e.clientY }; }

		this.imagePosition.x += e.clientX - this.moveDelta.x;
		this.imagePosition.y += e.clientY - this.moveDelta.y;

		this.moveDelta.x = e.clientX;
		this.moveDelta.y = e.clientY;

		const correctedPosition = this.getCorrectedPosition(this.imagePosition);

		this.previewImage.nativeElement.style.left = correctedPosition.x + 'px';
		this.imagePosition.x = correctedPosition.x;

		this.previewImage.nativeElement.style.top = correctedPosition.y + 'px';
		this.imagePosition.y = correctedPosition.y;

		return false;
	}

	setZoom(value: string) {
		let parsedValue = parseFloat(value);
		if (parsedValue <= 0) { parsedValue = 1; }
		if (parsedValue > this.zoomConfig.max) { parsedValue = this.zoomConfig.max; }

		this.zoomConfig.value = parsedValue;

		const newDimensions = {
			width: this.originalImageDimensions.width * this.zoomConfig.value,
			height: this.originalImageDimensions.height * this.zoomConfig.value,
		};

		const hdiff = newDimensions.width - this.imageDimensions.width;
		const vdiff = newDimensions.height - this.imageDimensions.height;

		this.imageDimensions.width = newDimensions.width;
		this.imageDimensions.height = newDimensions.height;

		const img = this.previewImage.nativeElement;

		img.style.width = newDimensions.width + 'px';
		img.style.height = newDimensions.height + 'px';

		const correctedPosition = this.getCorrectedPosition({
			x: this.imagePosition.x - (hdiff / 2),
			y: this.imagePosition.y - (vdiff / 2)
		});

		img.style.left = correctedPosition.x + 'px';
		img.style.top = correctedPosition.y + 'px';

		this.imagePosition.x = correctedPosition.x;
		this.imagePosition.y = correctedPosition.y;

		img.className = 'zooming';

		let finishTransition: EventListener;
		finishTransition = () => {
			img.className = '';
			img.removeEventListener('transitionend', finishTransition);
			this.configChange.emit({ left: this.imagePosition.x, top: this.imagePosition.y, zoom: this.zoom });
		};

		img.addEventListener('transitionend', finishTransition);
	}

	getBlob() {
		this.crop();
		return this.editable.getBlob();
	}

	getDataURL() {
		this.crop();
		return this.editable.getDataURL();
	}

	protected crop() {
		const proportions = this.imageDimensions.width / this.editable.image.width;

		const sx = (this.borders.hborder - this.imagePosition.x) / proportions;
		const sy = (this.borders.vborder - this.imagePosition.y) / proportions;
		const sw = (this.cropDimensions.width / proportions);
		const sh = sw / (this.cropWidth / this.cropHeight);

		this.editable.apply('crop', sx, sy, sw, sh, 0, 0, this.cropWidth, this.cropHeight);
	}

	protected getCorrectedPosition(pos: { x: number, y: number }): { x: number, y: number } {
		const corrected = { x: 0, y: 0 };
		const hdiff = this.cropDimensions.width - this.imageDimensions.width;
		const vdiff = this.cropDimensions.height - this.imageDimensions.height;

		if (pos.x < this.borders.hborder) {
			if (pos.x < this.borders.hborder + hdiff) {
				corrected.x = this.borders.hborder + hdiff;
			}
			else {
				corrected.x = pos.x;
			}
		}
		else {
			corrected.x = this.borders.hborder;
		}

		if (pos.y < this.borders.vborder) {
			if (pos.y < this.borders.vborder + vdiff) {
				corrected.y = this.borders.vborder + vdiff;
			}
			else {
				corrected.y = pos.y;
			}
		}
		else {
			corrected.y = this.borders.vborder;
		}

		return corrected;
	}

	protected stopMove() {
		delete this.moveDelta;

		window.removeEventListener('mousemove', this.eventListeners.mousemove);
		window.removeEventListener('mouseup', this.eventListeners.mouseup);

		this.configChange.emit({ left: this.imagePosition.x, top: this.imagePosition.y, zoom: this.zoom });
		return false;
	}

	protected fitArea(object: Dimension, area: Dimension) {
		const ph = object.height / area.height;
		const pw = object.width / area.width;
		const scale = ph > pw ? ph : pw;
		return { width: object.width / scale, height: object.height / scale };
	}

	protected fillArea(object: Dimension, area: Dimension) {
		const ph = object.height / area.height;
		const pw = object.width / area.width;
		const scale = ph > pw ? pw : ph;
		return { width: object.width / scale, height: object.height / scale };
	}

	protected addTransparentBorder(previewDimensions: Dimension, fittingDimensions: Dimension) {
		const vborder = (previewDimensions.height - fittingDimensions.height) / 2;
		const hborder = (previewDimensions.width - fittingDimensions.width) / 2;

		const borderElement = _(this.el.nativeElement.childNodes)
			.find((c: HTMLElement) => !!c.className && c.className.indexOf('border') >= 0);

		const cs = window.getComputedStyle(borderElement as Element);

		if (borderElement) {
			borderElement.style.borderBottomWidth = vborder + 'px';
			borderElement.style.borderTopWidth = vborder + 'px';

			borderElement.style.borderLeftWidth = hborder + 'px';
			borderElement.style.borderRightWidth = hborder + 'px';
		}
		return { vborder, hborder };
	}

	protected getComputedDimensions(element: HTMLElement) {
		const cs = window.getComputedStyle(element);
		return { width: parseInt(cs.width as string, 10), height: parseInt(cs.height as string, 10) };
	}
}

export type Dimension = { width: number, height: number };
