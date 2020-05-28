import { Component, OnInit } from '@angular/core';

import { FileRepositoryService } from 'mc-image-editor';

@Component({
  selector: 'file-reader-demo',
  templateUrl: './file-reader-demo.component.html',
  styleUrls: ['./file-reader-demo.component.css']
})
export class FileReaderDemoComponent implements OnInit {
	images: Array<{ name: string, data: string }>;

	constructor(public readonly fileRepositoryService: FileRepositoryService) {}

  ngOnInit(): void {
  }

}
