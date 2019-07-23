import { Component, OnInit, OnDestroy, EventEmitter, Renderer2, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';
import { SafeUrl, ɵDomSanitizerImpl, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { UploadFileDialogComponent } from './upload-file-dialog';
import { filter } from 'rxjs/operators';
import { FileHandle } from '../directives/file-drop.directive';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  private close = new EventEmitter<{}>();

  // private _filehandle: FileHandle = '';
  imageDiscription = '';
  imageUrl: SafeUrl = '';
  imageSize = 0;
  sizeUnit = '';
  fileName = '';
  imageFile: File;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    protected sanitizer: DomSanitizer,
    protected sanitizerImpl: ɵDomSanitizerImpl,
  ) { }

  ngOnInit() {
    // console.log(`SampleComponent.ngOnInit >> no="${this._no}"`);
  }

  ngOnDestroy() {
    // console.log(`SampleComponent.ngOnDestroy >> no="${this._no}"`);
  }

  public get closing(): Observable<{}> {
    return this.close;
  }

  public set filehandle(value: FileHandle) {
    if (value.file) {
      this.file = value.file;
      this.size = value.file.size;
      this.url = value.url;
    }
  }

  // public get file(): File {
  //   return this.file;
  // }
  public set file(value: File) {
    this.imageFile = value;
  }

  public set url(value: SafeResourceUrl) {
    this.imageUrl = value;
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

  public set discription(value: string) {
    this.imageDiscription = value;
  }
  public set filename(value: string) {
    this.fileName = value;
  }

  edit() {
    console.log('this.file:', this.file);
    console.log('this.imageDiscription:', this.imageDiscription);
    console.log('this.fileName:', this.fileName);
    console.log('this.imageUrl:', this.imageUrl);

    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '32.5rem',
      disableClose: true,
      // data: {file: file.file, url: file.url}
      data: {file: this.file, discription: this.imageDiscription, filename: this.fileName}
    });
    dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
      (value) => {
        console.log('value111: ', value);
        // this.addPreview(value.discription, value.data, value.filename);
      }
    );
  }

  upload() {}

  delete(): void {
    this.close.emit({});
  }

  download(): void {
    const sanitizedUrl = this.sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL,  this.imageUrl);
    const a = this.renderer.createElement('a') as HTMLAnchorElement;
    a.href = sanitizedUrl;
    a.setAttribute('download', this.fileName);
    a.click();
  }
}

