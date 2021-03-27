import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CrudService} from "../../services/crud.service";
import {Station} from "../../models/station";
import {GoogleMap} from "@angular/google-maps";
import {FirestoreService} from "../../services/firestore.service";
import {GeolocationService} from "../../services/geolocation.service";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {StationDetailsComponent} from "../../bottomsheets/station-details/station-details.component";
import {StationFilterComponent} from "../../bottomsheets/station-filter/station-filter.component";
import {FilterService} from "../../services/filter.service";
import {StationListComponent} from "../../bottomsheets/station-list/station-list.component";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet/bottom-sheet-ref";
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild(GoogleMap, {static: false}) map: GoogleMap;

  apiLoaded: Observable<boolean>;
  stations: Station[] = [];
  filteredStations: Station[] = [];
  displayedStations: Station[] = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false
  };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'assets/markers/fuel.png'
  };
  myPositionOptions: google.maps.MarkerOptions = {
    icon: 'assets/markers/me.png'
  };
  zoom = 5;
  center = null;
  // currentUserPosition = null;
  listInstance: MatBottomSheetRef<StationListComponent> = null;
  loading = false;

  constructor(httpClient: HttpClient,
              private crudService: CrudService,
              private bottomSheet: MatBottomSheet,
              private filterService: FilterService,
              private geolocationService: GeolocationService,
              private mapService: MapService,
              private firestoreService: FirestoreService) {

    this.apiLoaded = httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.mapsApiKey}`, 'callback')
      .pipe(
        map(() => true),
        catchError((err) => {
          console.error('error', err);
          return of(false)
        }),
      );
  }

  ngOnInit(): void {
    this.mapService.mapMovementBS.subscribe((station: Station) => {
      if (station) {
        this.mapService.savedPosition = {
          center: this.map.getCenter(),
          zoom: this.map.getZoom()
        };
        this.center = station.position ? station.position : new google.maps.LatLng(station.latitude, station.longitude);
        this.map.zoom = 16;
      } else if (this.stations.length) {
        this.center = this.mapService.savedPosition.center;
        this.map.zoom = this.mapService.savedPosition.zoom;
      }
    })
  }

  ngAfterViewInit(): void {
    const q = new Promise(resolve => {
      this.firestoreService.list('stations').subscribe((stations) => {

        this.stations = stations.map((s) => {
          const station = <Station>s.payload.doc.data();
          station.position = new google.maps.LatLng(station.latitude, station.longitude);
          return station;
        });
        this.filteredStations = [...this.stations];
        this.fillUpFilters(this.stations);
        resolve();
      });
    });

    this.setCurrentPosition(q);
  }

  setCurrentPosition(q=null) {
    this.loading = true;
    this.geolocationService.getLocation().subscribe(res => {
      this.currentUserPosition = {
        lat: res['location'].lat,
        lng: res['location'].lng,
      };
      setTimeout(async () => {
        this.center = new google.maps.LatLng(this.currentUserPosition.lat, this.currentUserPosition.lng);
        this.currentUserPosition['position'] = this.center;
        this.zoom = 12;
        if (q) {
          await q;
        }
        this.onBoundsChange();
        this.loading = false;
      }, 500);
    });
  }

  onBoundsChange() {
    this.displayedStations = this.filteredStations.filter(s => {
      return this.map.getBounds().contains(s.position);
    });
    if (this.listInstance) {
      this.listInstance.instance.data = [...this.displayedStations];
      this.listInstance.instance.sortData();
    }
  }



  openStationDetails(s: Station) {
    this.bottomSheet.open(StationDetailsComponent, {
      data: s,
    });
  }

  fillUpFilters(stations: Station[]) {
    this.filterService.possibleServices = [];
    stations.forEach(s => {
      s.services.forEach(service => {
        if (this.filterService.possibleServices.indexOf(service) === -1) {
          this.filterService.possibleServices.push(service);
        }
      })
    });

    this.filterService.possibleFuels = [];
    stations.forEach(s => {
      s.prix.forEach(p => {
        if (this.filterService.possibleFuels.indexOf(p.nom) === -1) {
          this.filterService.possibleFuels.push(p.nom);
        }
      })
    });
  }

  openFilter() {
    this.bottomSheet.open(StationFilterComponent).afterDismissed().subscribe(filter => {
      if (filter) {
        this.applyFilters();
      }
    });
  }

  openList() {
    const ref = this.bottomSheet.open(StationListComponent, {
      hasBackdrop: false,
      data: this.displayedStations
    });
    ref.afterDismissed().subscribe(() => {
      this.listInstance = null;
    })
    this.listInstance = ref;
  }

  applyFilters() {
    if (this.filterService.filters.fuels.length === 0 && this.filterService.filters.services.length === 0) {
      this.filteredStations = [...this.stations];
      this.onBoundsChange();
      return;
    }
    this.filteredStations = this.stations.filter((s) => {
      let exists = false;
      if (this.filterService.filters.services.length > 0) {
        this.filterService.filters.services.forEach(service => {
          if (s.services.indexOf(service) > -1) {
            exists = true;
          }
        });
      }
      if (this.filterService.filters.fuels.length > 0) {
        this.filterService.filters.fuels.forEach(service => {
          if (s.prix.map(p => p.nom).indexOf(service) > -1) {
            exists = true;
          }
        });
      }
      return exists;
    });
    this.onBoundsChange();
  }

  get currentUserPosition() {
    return this.mapService.currentUserPosition;
  }

  set currentUserPosition(value) {
    this.mapService.currentUserPosition = value;
  }


}
