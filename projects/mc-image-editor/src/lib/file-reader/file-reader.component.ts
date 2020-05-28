import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ChangeDetectionStrategy
} from '@angular/core';

import { FileRepositoryService } from '../file-repository/file-repository.service';

@Component({
	selector: 'file-reader',
	templateUrl: './file-reader.component.html',
	styleUrls: ['./file-reader.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileReaderComponent {
	private _dropzone: boolean;
	private _multiple: boolean;

	@Output('fileAppend') onFileAppend = new EventEmitter();

	@Input() accept: string = '*';
	@Input() scope: string = '';

	@Input() set multiple(value: boolean) { this._multiple = typeof value !== 'undefined'; };
	@Input() set dropzone(value: boolean) {
		this._dropzone = typeof value !== 'undefined';
		if (!this._dropzone) { this._multiple = true; }
	};

	get multiple(): boolean { return this._multiple; };
	get dropzone(): boolean { return this._dropzone; };

	@HostListener('dragover', ['$event']) onDragOver($event: any) {
		$event.stopPropagation();
		$event.preventDefault();
	}

	@HostListener('drop', ['$event']) onDrop($event: any) {
		$event.stopPropagation();
		$event.preventDefault();
	}

	constructor(private readonly fileRepositoryService: FileRepositoryService) { }


	readFiles(files: Array<File>) {
		const changed: Array<File> = [ ...files ].map(f => {
			if (f.type.match(this.accept.replace('*', '.*'))) {
				this.fileRepositoryService.scope(this.scope).push(f)

				return f;
			}
		});

		this.onFileAppend.emit(changed);

		return changed;
	}

	filesAppend(files: Array<File>) {
		this.onFileAppend.emit(this.readFiles(files));
	}
}
