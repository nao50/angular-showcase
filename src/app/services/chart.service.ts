import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  public subjectdata0() {
    return interval(1200).pipe(map(x => Math.floor(Math.random() * 500) - 100), startWith(0));
  }
  public subjectdata1() {
    return interval(1100).pipe(map(x => Math.floor(Math.random() * 200) - 20), startWith(0));
  }
  public subjectdata2() {
    return interval(1000).pipe(map(x => Math.floor(Math.random() * 200) - 100), startWith(0));
  }
  public subjectdata3() {
    return interval(1300).pipe(map(x => Math.floor(Math.random() * 200) - 100), startWith(0));
  }
}
