import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  toolbarMenuString: string;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('userName')) {
      this.toolbarMenuString = localStorage.getItem('userName');
    } else {
      this.toolbarMenuString = 'MENU';
    }
  }

}
