import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, map } from 'rxjs';
import { Station } from 'src/app/models/station';
import { LoaderService } from 'src/app/services/loader.service';
import { MapService } from 'src/app/services/map.service';
import { StationsService } from 'src/app/services/stations.service';
import { BottomsheetComponent } from '../bottomsheet/bottomsheet.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  apiLoaded: Observable<boolean>;
  positionLoaded = false;
  stations: Station[] = [];

  @ViewChild(GoogleMap) googleMap: GoogleMap | undefined;

  center = { lat: 46.35596877651164, lng: 2.758517701677623 };
  zoom = 5;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    mapId: 'fbf73d34d2ad427b',
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ],
    // mapTypeControl: true,
  };

  timeoutId = 0;

  constructor(
    private loaderService: LoaderService,
    private stationsService: StationsService,
    private mapService: MapService,
    private bottomsheet: MatBottomSheet
  ) {
    this.loaderService.loading = true;
    this.apiLoaded = this.mapService.loadMap().pipe(
      map((value) => {
        this.moveToPosition();
        return value;
      })
    );
  }

  ngOnInit(): void {}

  initMap() {
    this.mapService.map = this.googleMap;
  }

  moveToPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.zoom = 12;
        this.loaderService.loading = false;
        this.positionLoaded = true;
        this.initMap();
      });
    }
  }

  openInfo(station: Station) {
    this.bottomsheet.open(BottomsheetComponent, {
      data: station,
      panelClass: 'station-panel-info',
      backdropClass: 'station-backdrop-info',
    });
  }

  mapChanged() {
    if (!this.positionLoaded) {
      return;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.loaderService.loading = true;
      this.stationsService
        .getStations(this.mapService.getPayloadBounds())
        .subscribe({
          next: (stations) => {
            this.stations = <Station[]>stations;
          },
          error: (error) => {
            console.error('error', error);
          },
          complete: () => {
            this.timeoutId = 0;
            this.loaderService.loading = false;
          },
        });
    }, 500);
  }
}
