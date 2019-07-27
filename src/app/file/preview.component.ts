import { Component, OnInit, OnDestroy, EventEmitter, Renderer2, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeUrl, ɵDomSanitizerImpl, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { UploadFileDialogComponent } from './upload-file-dialog';
import { filter } from 'rxjs/operators';
import { FileHandle } from '../file/filehandle';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  private close = new EventEmitter<{}>();

  imageDiscription = '';
  imageUrl: SafeUrl = '';
  imageSize = 0;
  sizeUnit = '';
  fileName = '';
  imageFile: File;
  imagefileHandle: FileHandle;

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    protected sanitizer: DomSanitizer,
    private sanitizerImpl: ɵDomSanitizerImpl,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  public get closing(): Observable<{}> {
    return this.close;
  }

  // public set url(value: SafeResourceUrl) {
  //   this.imageUrl = value;
  // }

  public set fileHandle(value: FileHandle) {
    if (value.file) {
      this.imagefileHandle = value;

      this.imageDiscription = value.discription;
      this.size = value.file.size;
      this.fileName = value.file.name;
      this.imageUrl = value.url;
    }
  }

  public set size(value: number) {
    this.imageSize = value;
    if ((this.imageSize / 1000) < 1) {
        this.sizeUnit = this.imageSize + ' B';
    } else if ((this.imageSize / 1000000) < 1) {
        this.sizeUnit = Math.round(this.imageSize / 1000) + ' KB';
    } else if ((this.imageSize / 1000000) < 1) {
        this.sizeUnit = Math.round(this.imageSize / 1000000) + ' MB';
    }
  }

  edit() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '32.5rem',
      disableClose: true,
      data: this.imagefileHandle,
    });
    dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
      (value: FileHandle) => {
        this.imagefileHandle = value;

        this.imageDiscription = value.discription;
        this.size = value.file.size;
        this.fileName = value.file.name;
        this.imageUrl = value.url;
      }
    );
  }

  upload() {}

  delete(): void {
    this.close.emit({});
  }

  download(): void {
    const safe = 'changingThisBreaksApplicationSecurity';
    const a = this.renderer.createElement('a') as HTMLAnchorElement;

    a.href = this.imageUrl[safe];

    a.setAttribute('download', this.fileName);
    a.click();
  }
}

