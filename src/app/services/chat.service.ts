import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of, timer, interval, Subject, Observer } from 'rxjs';
import { catchError, retryWhen, timeout } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { CreateChatroom, ChatRoom } from '../chat/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
  ) { }

  // get session id
  getSessionID(): Observable<HttpResponse<string>> {
    const url = 'http://localhost:8080/sessionid';
    return this.http.get<string>(url, { observe: 'response' })
    .pipe(
      catchError(this.handleError),
    );
  }

  // serve() {
  serve(roomid: string, userID: string): WebSocketSubject<MessageEvent> {
    return webSocket({
      url: `ws://localhost:8080/ws/${roomid}?userID=${userID}`,
      deserializer: message => {
        return message;
      }
    });
  }


  createChatroom(name: string, description: string): Observable<string[]> {
    const url = 'http://localhost:8080/createroom';
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type': 'application/json',
      })
    };
    return this.http.post<string[]>(
      url,
      JSON.stringify({ 'name': name, 'discription': description }),
      httpOptions
    );
  }

  getChatroomList(): Observable<HttpResponse<ChatRoom[]>> {
    const url = 'http://localhost:8080/rooms';

    return this.http.get<ChatRoom[]>(url, { observe: 'response' })
    .pipe(
      timeout(2500),
      catchError(this.handleError),
    );
  }
  // getChatroomList(): Observable<HttpResponse<string[]>> {
  //   const url = 'http://localhost:8080/rooms';

  //   return this.http.get<string[]>(url, { observe: 'response' })
  //   .pipe(
  //     timeout(2500),
  //     catchError(this.handleError),
  //   );
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(error.error);
  }
}
