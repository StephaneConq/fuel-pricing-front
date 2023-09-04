import {
  HttpClient,
  HttpParams,
  HttpParamsOptions,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  constructor(private httpClient: HttpClient) {}

  getStations(bounds: any) {
    const options = {};
    if (bounds) {
      // @ts-ignore
      options['params'] = new HttpParams({ fromObject: bounds });
    }

    return this.httpClient.get('http://0.0.0.0:8000/api/stations', options);
  }
}
