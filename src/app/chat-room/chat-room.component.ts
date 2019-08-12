import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { ChatService } from '../services/chat.service';

import { Subscription } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

export interface ChatMessage {
  message: string;
  userID: string;
  userName: string;
  date: Date;
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  subject: WebSocketSubject<unknown>;
  message: ChatMessage;
  messages: ChatMessage[] = [];
  sessionSubscription: Subscription;
  sessionID = '';

  chatFormGroup = this.formBuilder.group({
    message: [''],
    userID: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('userID')) {
      this.getSessionID();
    } else {
      this.sessionID = JSON.parse(localStorage.getItem('userID'));
    }

    const roomid = this.activatedRoute.snapshot.paramMap.get('roomid');
    this.subject = this.chatService.serve(roomid, this.sessionID);
    this.subject.subscribe(
      (message: MessageEvent) => {
        this.message = JSON.parse(message.data) as ChatMessage;
        this.message.userName = this.message.userID.slice(0, 2);
        this.messages.push(this.message);
      }, (err) => {
        if (err.type === 'error' ) {
          this.router.navigate(['/chat']);
        }
        if (err.type === 'close' ) {
          if (this.message) {
            // TODO
            this.message.message = 'This room is closed!';
            this.messages.push(this.message);
          }
        }
      }, () => {
        console.log('complete');
      }
    );
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

  postMessage() {
    if (this.chatFormGroup.value.message) {
      this.chatFormGroup.patchValue({
        userID: this.sessionID,
        userName: this.sessionID.slice(0, 2),
        date: new Date(),
      });
      this.subject.next(this.chatFormGroup.value);

      this.chatFormGroup.patchValue({
        message: '', userID: '', userName: '', date: '',
      });
    }
  }

}
