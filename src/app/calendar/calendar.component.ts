import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class CalendarComponent implements OnInit {
  dateTime: string;
  dateTimeChoice: string[] = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'];
  hours: string[];
  minitues: string[];

  calendars = [
    {value: 'Google Calendar'},
    {value: 'iCal'},
    {value: 'Outlook'},
  ];

  calendarFormGroup = this.formBuilder.group({
    title: [''],
    calender: ['Google Calendar', [Validators.required]],
    startDate: [new Date()],
    startTime: ['Google Calendar'],
    endDate: [new Date()],
    endTime: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private adapter: DateAdapter<any>,
  ) { }

  ngOnInit() {
    this.hours = this.toDoubleDigits(Array.apply(null, {length: 24}).map(Number.call, Number));
    this.minitues = this.toDoubleDigits(Array.apply(null, {length: 60}).map(Number.call, Number));

    console.log('this.minitues:', this.minitues);
  }

  toDoubleDigits(n: number[]): string[] {
    const nStrings = [];
    for (let i = 0; i < n.length; i++) {
      let nString = String(n[i]);
      if (nString.length === 1) {
        nString = '0' + nString;
      }
      nStrings.push(nString);
    }
    return nStrings;
  }

  toDoubleDigit(n: number): string {
    let Strings = String(n);
    if (Strings.length === 1) {
      Strings = '0' + Strings;
    }
    return Strings;
  }

}
