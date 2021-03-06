import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileHandle } from '../file/filehandle';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  @HostBinding('style.background') public background = '';
  @HostBinding('class.is-over') public isOver: boolean;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    this.isOver = ['dragenter', 'dragover'].indexOf(event.type) >= 0;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '';
    this.isOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '';
    this.isOver = false;

    const files: FileHandle[] = [];

    for (let i = 0, len = evt.dataTransfer.files.length; i < len; i++) {
      const file = evt.dataTransfer.files[i];

      const url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }

    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
