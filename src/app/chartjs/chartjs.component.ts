import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Chart } from 'chart.js';
import { ChartService } from '../services/chart.service';

export interface ChartContent {
  background: string;
  color: string;
  title: string;
  icon?: string;
  svgIcon?: string;
  value: number;
  changeRate: number;
  description: string;
}

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss']
})
export class ChartjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  randomNumber01: number;
  randomNumber01List: number[] = [];
  randomNumber01Color: string;
  changeRate01: number;

  contents: ChartContent[] = [
    {background: '#3f51b5', color: '#fff', title: 'Unique Users', icon: 'group', value: 0, changeRate: 0, description: 'aaa'},
    {background: '#673ab7', color: '#fff', title: 'Sessions', icon: 'forum', value: 241, changeRate: 0, description: 'bbb'},
    {background: '#e91e63', color: '#fff', title: 'Bounce Rate', icon: 'keyboard_return', value: 52, changeRate: 0, description: 'ccc'},
    {background: '#9c27b0', color: '#fff', title: 'Session Duration', icon: 'alarm', value: 159, changeRate: 0, description: 'ddd'},
  ];

  context01: CanvasRenderingContext2D;
  @ViewChild('toplinechart', {static: true}) toplinechart: ElementRef;

  time = new Date();
  timer: NodeJS.Timer;

  constructor(
    private chartService: ChartService,
  ) { }

  ngOnInit() {
    this.timer = setInterval(() => this.time = new Date(), 1000);

    this.chartService.subjectdata01();

    this.subscription = this.chartService.subjectdata01().subscribe(
      (value: number) => {
        // Get random number
        this.randomNumber01 = value;

        if (this.randomNumber01 < -25) {
          this.randomNumber01Color = 'red';
        } else if (-25 < this.randomNumber01 && 25 > this.randomNumber01) {
          this.randomNumber01Color = 'black';
        } else if (this.randomNumber01 > 25) {
          this.randomNumber01Color = 'blue';
        }

        // calcurate rate
        if (this.randomNumber01List.length < 2) {
          this.randomNumber01List.push(this.randomNumber01);
        } else {
          this.randomNumber01List.shift();
          this.randomNumber01List.push(this.randomNumber01);
        }
        this.changeRate01 = Math.round(((this.randomNumber01List[0] / this.randomNumber01List[1]) - 1) * 100);

        //
        this.contents = [
          {background: '#3f51b5', color: '#fff', title: 'Unique Users', icon: 'group', value: this.randomNumber01, changeRate: this.changeRate01, description: 'aaa'},
          {background: '#673ab7', color: '#fff', title: 'Sessions', icon: 'forum', value: 241, changeRate: 0, description: 'bbb'},
          {background: '#e91e63', color: '#fff', title: 'Bounce Rate', icon: 'keyboard_return', value: 52, changeRate: 0, description: 'ccc'},
          {background: '#9c27b0', color: '#fff', title: 'Session Duration', icon: 'alarm', value: 159, changeRate: 0, description: 'ddd'},
        ];
      }
    );

    this.drawTopLineChart();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.subscription) {
      console.log('this.subscription', this.subscription);
      this.subscription.unsubscribe();
      console.log('this.subscription', this.subscription);
    }
  }

  drawTopLineChart() {
    this.toplinechart.nativeElement.width = '50%';
    this.toplinechart.nativeElement.height = '50%';

    this.context01 = this.toplinechart.nativeElement.getContext('2d');
    const toplinechart = new Chart(this.context01, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Data01',
          backgroundColor: 'rgba(255, 255, 153, 0.5)',
          borderColor: 'rgba(255, 99, 132, 0)',
          pointRadius: 0,
          fill: true,
          data: [
            { x: 0, y: 2 },
            { x: 1, y: 1 },
            { x: 2, y: 2.5 },
            { x: 3, y: 5 },
            { x: 4, y: 3 },
            { x: 5, y: 4 },
            { x: 6, y: 9 },
            { x: 7, y: 7 },
            { x: 8, y: 12 },
          ],
        }, {
          label: 'Data02',
          backgroundColor: 'rgba(153, 255, 255, 0.5)',
          borderColor: 'rgba(255, 99, 132, 0)',
          pointRadius: 0,
          fill: true,
          data: [
            { x: 0, y: 1 },
            { x: 1, y: 4 },
            { x: 2, y: 8 },
            { x: 3, y: 12 },
            { x: 4, y: 1 },
            { x: 5, y: 5 },
            { x: 6, y: 2 },
            { x: 7, y: 3 },
            { x: 8, y: 1 },
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        title: {
          display: true,
          text: 'Angular & Chart.js'
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
              labelString: 'X',
              display: true,
            }
          }],
          yAxes: [{
            type: 'linear',
            scaleLabel: {
              labelString: 'Y',
              display: true
            }
          }]
        }
      }
    });
  }

}
