import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public data01Subject = new Subject<number>();
  public data01State = this.data01Subject.asObservable();

  constructor() { }

  public subjectdata01(): void {
    interval(1000).subscribe(x => this.data01Subject.next((Math.floor(Math.random() * 200) - 100)));
  }
}
