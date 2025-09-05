import { Component, AfterViewInit } from '@angular/core';
import grapesjs from 'grapesjs';

@Component({
  selector: 'app-grapes-editor',
  standalone: true,
  imports: [],
  templateUrl: './grapes-editor.component.html',
  styleUrl: './grapes-editor.component.scss'
})
export class GrapesEditorComponent implements AfterViewInit {
  editor: any;

  ngAfterViewInit(): void {
    this.editor = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      width: 'auto',
      fromElement: true,
      storageManager: false,
      plugins: [],
    });
  }
}
