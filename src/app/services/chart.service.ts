import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  public subjectdata01() {
    return interval(1000).pipe(map(x => Math.floor(Math.random() * 200) - 100), startWith(0));
  }
}
