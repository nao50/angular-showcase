import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';

import { debounceTime } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material';

import * as L from 'leaflet';

export interface GeoLocations {
  lat: number;
  lon: number;
  timestamp: number;
}

export interface GeoTable {
  index: number;
  time: Date;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  // locationsSubscription: Observable<Position>;
  locationsSubscription: any;
  geoLocation: GeoLocations;
  geoLocationArray: GeoLocations[] = [];
  initialize = false;
  subscribeLocation = false;

  // datatable
  geotable: GeoTable[] = [];
  displayedColumns: string[] = ['index', 'time', 'lat', 'lon'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data = new MatTableDataSource(this.geotable);
  i = 1;

  constructor(
    private geolocationService: GeolocationService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscribeGeolocation();
  }

  ngOnDestroy() {
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
  }

  subscribeGeolocation() {
    this.locationsSubscription = this.geolocationService.createWatchPosition()
    .pipe(
      debounceTime(1000)
    ).subscribe(
      (value: Position) => {
        this.geoLocation = {} as GeoLocations;
        this.geoLocation.lat = value.coords.latitude;
        this.geoLocation.lon = value.coords.longitude;
        this.geoLocation.timestamp = value.timestamp;

        // Add Table
        if (this.geotable.length < 10) {
          this.geotable.push(
            {index: this.i, time: new Date(value.timestamp), lat: value.coords.latitude, lon: value.coords.longitude}
          );
        } else {
          this.geotable.shift();
          this.geotable.push(
            {index: this.i, time: new Date(value.timestamp), lat: value.coords.latitude, lon: value.coords.longitude}
          );
        }
        this.data = new MatTableDataSource(this.geotable);
        this.i++;

        // Add Map
        if (this.geoLocationArray.length < 10) {
          this.geoLocationArray.push(this.geoLocation);
        } else {
          this.geoLocationArray.shift();
          this.geoLocationArray.push(this.geoLocation);
        }

        if (!this.initialize) {
          this.initMap(this.geoLocation.lat, this.geoLocation.lon);
        }

        this.subscribeLocation = true;

        this.setMaker();

      },
      error => {
        console.log('error:', error);
      }
    );
  }

  unsubscribeGeolocation() {
    this.locationsSubscription.unsubscribe();
    this.subscribeLocation = false;
  }

  initMap(lat: number, lon: number) {
    this.map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.initialize = true;
  }

  setMaker() {
    const polylineArray = [];

    if (this.geoLocationArray) {
      for (let i = 0; this.geoLocationArray.length > i; i++ ) {
        const date = new Date(this.geoLocationArray[i].timestamp);

        // Add marker
        L.marker(
          [this.geoLocationArray[i].lat, this.geoLocationArray[i].lon]
        ).bindPopup(
          '<b>Hello!!</b><br>  ' + (date.getMonth() + 1) + '/' + date.getDate()
        ).addTo(this.map);

        this.map.flyTo([this.geoLocationArray[i].lat, this.geoLocationArray[i].lon], 14, { duration: 2 });

        // polylineArray
        polylineArray.push( [this.geoLocationArray[i].lat, this.geoLocationArray[i].lon]);

        // Add line
        L.polyline([polylineArray], {color: '#FF0000', weight: 5, opacity: 0.6})
          .addTo(this.map);

      }
    }
  }

}
