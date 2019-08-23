import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, Validators } from '@angular/forms';

import { CreateChatroom } from './chat';

@Component({
    selector: 'app-create-chatroom-dialog',
    templateUrl: 'create-chatroom-dialog.html',
    styleUrls: ['./create-chatroom-dialog.scss']
})
export class CreateChatroomDialogComponent implements OnInit {
  chatroomFormGroup = this.formBuilder.group({
    roomName: ['', [Validators.required]],
    discription: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateChatroomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateChatroom
  ) {}

  ngOnInit() {}

  create() {
    this.dialogRef.close(this.chatroomFormGroup.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
