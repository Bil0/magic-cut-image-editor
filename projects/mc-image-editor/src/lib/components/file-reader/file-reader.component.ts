import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ChangeDetectionStrategy
} from '@angular/core';

import { FileRepositoryService } from '../../services/file-repository/file-repository.service';

@Component({
	selector: 'mc-file-reader',
	templateUrl: './file-reader.component.html',
	styleUrls: ['./file-reader.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileReaderComponent {
	private _dropzone: boolean;
	private _multiple: boolean;

	@Output() fileAppend = new EventEmitter();

	@Input() accept = '*';
	@Input() scope = '';

	@Input() set multiple(value: boolean) { this._multiple = typeof value !== 'undefined'; }
	get multiple(): boolean { return this._multiple; }

	@Input() set dropzone(value: boolean) {
		this._dropzone = typeof value !== 'undefined';
		if (!this._dropzone) { this._multiple = true; }
	}
	get dropzone(): boolean { return this._dropzone; }


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
				this.fileRepositoryService.scope(this.scope).push(f);

				return f;
			}
		});

		this.fileAppend.emit(changed);

		return changed;
	}

	onFilesAppend(files: Array<File>) {
		this.fileAppend.emit(this.readFiles(files));
	}
}
