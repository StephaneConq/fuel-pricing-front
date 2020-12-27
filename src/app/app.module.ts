import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import {GoogleMapsModule} from "@angular/google-maps";
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";
import {LocalInterceptor} from "./interceptor/local.interceptor";
import {ProdInterceptor} from "./interceptor/prod.interceptor";
import {MaterialModule} from "./material/material.module";
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import { StationDetailsComponent } from './bottomsheets/station-details/station-details.component';
import { StationFilterComponent } from './bottomsheets/station-filter/station-filter.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StationListComponent } from './bottomsheets/station-list/station-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StationDetailsComponent,
    StationFilterComponent,
    StationListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firestore),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: environment.production ? ProdInterceptor : LocalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
