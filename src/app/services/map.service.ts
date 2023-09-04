import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { LoaderService } from './loader.service';
import { GoogleMap } from '@angular/google-maps';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(
    private httpClient: HttpClient,
    private loaderService: LoaderService
  ) {}

  map: GoogleMap | undefined;

  loadMap() {
    return this.httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyApSO9HcUkOhzVZKR9vWCrdN-StBUCRPUE',
        'callback'
      )
      .pipe(
        map(() => {
          return true;
        }),
        catchError(() => {
          this.loaderService.loading = false;
          return of(false);
        })
      );
  }

  getPayloadBounds() {
    if (!this.map) {
      return;
    }
    const bounds = this.map.getBounds();
    return {
      left_lat: bounds?.getSouthWest().lat(),
      left_lng: bounds?.getSouthWest().lng(),
      right_lat: bounds?.getNorthEast().lat(),
      right_lng: bounds?.getNorthEast().lng(),
    };
  }
}
