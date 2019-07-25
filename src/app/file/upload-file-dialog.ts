import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Renderer2, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FileHandle } from '../file/filehandle';

@Component({
    selector: 'app-upload-file-dialog',
    templateUrl: 'upload-file-dialog.html',
    styleUrls: ['./upload-file-dialog.scss']
  })
  export class UploadFileDialogComponent implements OnInit {
    fileFormGroup = this.formBuilder.group({
      discription: [''],
      filename: ['', [Validators.required]],
    });

    constructor(
      private formBuilder: FormBuilder,
      // private renderer: Renderer2,
      public dialogRef: MatDialogRef<UploadFileDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: FileHandle
    ) {}

    ngOnInit() {
      if (this.data.file) {
        this.fileFormGroup.patchValue({
          discription: this.data.discription,
          filename: this.data.file.name,
        });
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    uploadFile() {
      this.data.discription = this.fileFormGroup.value.discription;

      this.dialogRef.close(this.data);
    }

}

