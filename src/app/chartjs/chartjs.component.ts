import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Chart } from 'chart.js';
import { ChartService } from '../services/chart.service';

export interface ChartContent {
  background: string;
  title: string;
  titleColor: string;
  icon?: string;
  svgIcon?: string;
  value: number;
  valueColor: string;
  changeRate: number;
  changeRateColor: string;
  description: string;
}

export interface Data01 {
  x: number;
  y: number;
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

  // data01: Data01;
  dataList01: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data01: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  dataList02: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  data02: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  contents: ChartContent[] = [
    {background: '#3f51b5', titleColor: '#fff', title: 'Unique Users', icon: 'group', value: 0, valueColor: 'black', changeRate: 0, changeRateColor: 'black', description: 'aaa'},
    {background: '#673ab7', titleColor: '#fff', title: 'Sessions', icon: 'forum', value: 241, valueColor: 'black', changeRate: 0, changeRateColor: 'black', description: 'bbb'},
    {background: '#e91e63', titleColor: '#fff', title: 'Bounce Rate', icon: 'keyboard_return', value: 52, valueColor: 'black', changeRate: 0, changeRateColor: 'black', description: 'ccc'},
    {background: '#9c27b0', titleColor: '#fff', title: 'Session Duration', icon: 'alarm', value: 159, valueColor: 'black', changeRate: 0, changeRateColor: 'black', description: 'ddd'},
  ];

  context01: CanvasRenderingContext2D;
  @ViewChild('toplinechart', {static: true}) toplinechart: ElementRef;

  time = new Date();
  // timer: NodeJS.Timer;
  timer: any;

  constructor(
    private chartService: ChartService,
  ) { }

  ngOnInit() {
    this.timer = setInterval(() => this.time = new Date(), 1000);

    this.subscription = this.chartService.subjectdata0().subscribe(
      (value: number) => {
        this.getData01(value);
        this.drawTopLineChart();
        this.contents[0].value = value;
        this.contents[0].valueColor = this.decideColor(value);
        this.contents[0].changeRate = this.getChangeRate(value);
        this.contents[0].changeRateColor = this.decideColor(this.contents[0].changeRate);
      }
    );
    this.subscription = this.chartService.subjectdata1().subscribe(
      (value: number) => {
        this.getData02(value);
        // this.drawTopLineChart();
        this.contents[1].value = value;
        this.contents[1].valueColor = this.decideColor(value);
        this.contents[1].changeRate = this.getChangeRate(value);
        this.contents[1].changeRateColor = this.decideColor(this.contents[1].changeRate);
      }
    );
    this.subscription = this.chartService.subjectdata2().subscribe(
      (value: number) => {
        this.contents[2].value = value;
        this.contents[2].valueColor = this.decideColor(value);
        this.contents[2].changeRate = this.getChangeRate(value);
        this.contents[2].changeRateColor = this.decideColor(this.contents[2].changeRate);
      }
    );
    this.subscription = this.chartService.subjectdata3().subscribe(
      (value: number) => {
        this.contents[3].value = value;
        this.contents[3].valueColor = this.decideColor(value);
        this.contents[3].changeRate = this.getChangeRate(value);
        this.contents[3].changeRateColor = this.decideColor(this.contents[3].changeRate);
      }
    );

    this.drawTopLineChart();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  decideColor(n: number): string {
    if (n < -25) {
      return 'red';
    } else if ( -25 < n && 25 > n ) {
      return 'black';
    } else if ( n > 25 ) {
      return 'blue';
    }
  }

  getChangeRate(n: number): number {
    if (this.randomNumber01List.length < 2) {
      this.randomNumber01List.push(n);
    } else {
      this.randomNumber01List.shift();
      this.randomNumber01List.push(n);
    }
    return Math.round(((this.randomNumber01List[0] / this.randomNumber01List[1]) - 1) * 100);
  }

  getData01(n: number): number[] {
    if (this.dataList01.length < 11) {
      this.dataList01.push(n);
    } else {
      this.dataList01.shift();
      this.dataList01.push(n);
    }
    return this.dataList01;
  }
  getData02(n: number): number[] {
    if (this.dataList02.length < 11) {
      this.dataList02.push(n);
    } else {
      this.dataList02.shift();
      this.dataList02.push(n);
    }
    return this.dataList02;
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
            { x: 0, y: this.dataList01[0] },
            { x: 1, y: this.dataList01[1] },
            { x: 2, y: this.dataList01[2] },
            { x: 3, y: this.dataList01[3] },
            { x: 4, y: this.dataList01[4] },
            { x: 5, y: this.dataList01[5] },
            { x: 6, y: this.dataList01[6] },
            { x: 7, y: this.dataList01[7] },
            { x: 8, y: this.dataList01[8] },
            { x: 9, y: this.dataList01[9] },
            { x: 10, y: this.dataList01[10] },
          ],
        }, {
          label: 'Data02',
          backgroundColor: 'rgba(153, 255, 255, 0.5)',
          borderColor: 'rgba(255, 99, 132, 0)',
          pointRadius: 0,
          fill: true,
          data: [
            { x: 0, y: this.dataList02[0] },
            { x: 1, y: this.dataList02[1] },
            { x: 2, y: this.dataList02[2] },
            { x: 3, y: this.dataList02[3] },
            { x: 4, y: this.dataList02[4] },
            { x: 5, y: this.dataList02[5] },
            { x: 6, y: this.dataList02[6] },
            { x: 7, y: this.dataList02[7] },
            { x: 8, y: this.dataList02[8] },
            { x: 9, y: this.dataList02[9] },
            { x: 10, y: this.dataList02[10] },
          ],
        }]
      },
      options: {
        animation: {
          duration: 0
        },
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        title: {
          // display: true,
          display: false,
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
