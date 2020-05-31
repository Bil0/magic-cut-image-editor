import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-editor-demo';
  file: File;


  readImage(files: Array<File>) {
    this.file = files[0];
  }
}
