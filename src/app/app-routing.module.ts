import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// compornent
import { TopComponent } from './top/top.component';
import { FormAndValidationComponent } from './form-and-validation/form-and-validation.component';
import { FileComponent } from './file/file.component';
import { GeolocationComponent } from './geolocation/geolocation.component';

import { TodoListComponent } from './todo-list/todo-list.component';
import { ChatComponent } from './chat/chat.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientComponent } from './http-client/http-client.component';

const routes: Routes = [
  {
    path: 'top',
    component: TopComponent,
  },
  {
    path: 'form-validation',
    component: FormAndValidationComponent,
  },
  {
    path: 'file',
    component: FileComponent,
  },
  {
    path: 'geolocation',
    component: GeolocationComponent,
  },
  {
    path: 'todo-list',
    component: TodoListComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'chat/:roomid',
    component: ChatRoomComponent,
  },
  {
    path: 'chartjs',
    component: ChartjsComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'httpClient',
    component: HttpClientComponent,
  },
  {
    path: '**',
    redirectTo: 'top',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
