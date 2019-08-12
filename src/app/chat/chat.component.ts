import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CreateChatroomDialogComponent } from './create-chatroom-dialog';

import { CreateChatroom, ChatRoom } from './chat';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  roomList: ChatRoom[] = [];
  sessionSubscription: Subscription;
  sessionID = '';
  interval: any;

  constructor(
    public dialog: MatDialog,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('userID')) {
      this.getSessionID();
    } else {
      this.sessionID = JSON.parse(localStorage.getItem('userID'));
    }

    this.interval = setInterval(() => {
      this.chatService.getChatroomList().subscribe(
        (value: HttpResponse<ChatRoom[]>) => {
          this.roomList = value.body;
          // this.roomList.sort((a, b) => a.time.getTime() - b.time.getTime());
        }, (error) => {
          console.log(error);
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getSessionID() {
    this.sessionSubscription = this.chatService.getSessionID().subscribe(
      (value: HttpResponse<string>) => {
        this.sessionID = value.body;
        localStorage.setItem('userID', JSON.stringify(this.sessionID));
      }, (error) => {
        console.log(error);
      }
    );
  }

  openCreateChatroomDialog() {
    // TODO: Check many creater
    // Open Dialog
    const dialogRef = this.dialog.open(CreateChatroomDialogComponent, {
      width: '32.5rem',
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(filter(value => value)).subscribe(
      (value: CreateChatroom) => {
        this.chatService.createChatroom(value.name, value.discription)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }


}
