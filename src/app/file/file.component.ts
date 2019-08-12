import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import { FileHandle } from '../file/filehandle';
import { PreviewComponent } from './preview.component';
import { UploadFileDialogComponent } from './upload-file-dialog';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  factory: ComponentFactory<PreviewComponent>;
  @ViewChild('preview', {read: ViewContainerRef, static: true}) viewContainerRef: ViewContainerRef;

  @ViewChild('fileInput', {static: true}) fileInput;
  file: File | null = null;

  files: FileHandle[] = [];

  constructor(
    private resolver: ComponentFactoryResolver,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.factory = this.resolver.resolveComponentFactory(PreviewComponent);
  }

  addPreview(fileHandle: FileHandle) {
    const componentRef = this.viewContainerRef.createComponent(this.factory);

    componentRef.instance.fileHandle = fileHandle;

    componentRef.instance.closing.subscribe(() => {
      componentRef.destroy();
    });
  }

  filesDropped(files: FileHandle[]): void {
    for (const f of files) {
      const file = f;
      // Open Dialog
      const dialogRef = this.dialog.open(UploadFileDialogComponent, {
        width: '32.5rem',
        disableClose: true,
        data: file
      });
      dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
        (value: FileHandle) => {
          this.addPreview(value);
        }
      );
    }
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(files: File[]): void {
    this.files = [];

    for (const f of files) {
      const file = f;
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.files.push({ file, url });
    }

    for (const f of this.files) {
      const file = f;
      // Open Dialog
      const dialogRef = this.dialog.open(UploadFileDialogComponent, {
        width: '32.5rem',
        disableClose: true,
        data: file
      });
      dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
        (value: FileHandle) => {
          this.addPreview(value);
        }
      );
    }
  }

}

