import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private http: HttpClient
  ) { }

  getLocation() {
    return this.http.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${environment.mapsApiKey}`, {
      homeMobileCountryCode: '208',
      "radioType": "gsm",
    });
  }
}
