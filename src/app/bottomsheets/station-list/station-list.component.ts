import {Component, Inject, OnChanges, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Station} from "../../models/station";
import {MapService} from "../../services/map.service";
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})
export class StationListComponent implements OnInit {

  expanded = false;
  selectedStation: Station = null;
  sortOption = null;
  selectedFuel = null;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<StationListComponent>,
    private filterService: FilterService,
    private mapService: MapService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Station[]
  ) {
  }

  ngOnInit(): void {
  }

  openStationDetails(s: Station) {
    this.selectedStation = s;
    this.mapService.mapMovementBS.next(s);
  }

  get possibleFuels() {
    return this.filterService.possibleFuels;
  }

  sortData() {
    setTimeout(() => {
      if (this.sortOption === 'Prix') {
        this.sortByPrice();
      } else if (this.sortOption === 'Distance') {
        this.sortByDistance();
      }
    }, 500);
  }

  sortByPrice() {
    this.data.sort((a, b) => {
      if (!this.selectedFuel) {
        const aSum = a.prix.map(p => parseFloat(p.valeur)).reduce((previousValue, currentValue) => previousValue += currentValue);
        const bSum = b.prix.map(p => parseFloat(p.valeur)).reduce((previousValue, currentValue) => previousValue += currentValue);
        return aSum / a.prix.length - bSum / b.prix.length;
      } else {
        const aPrice = a.prix.find(p => p.nom === this.selectedFuel);
        const bPrice = b.prix.find(p => p.nom === this.selectedFuel);
        return (aPrice ? parseFloat(aPrice.valeur) : 999) - (bPrice ? parseFloat(bPrice.valeur) : 999);
      }
    });
  }

  sortByDistance() {
    this.data.sort((a, b) => {
      const aDistance = this.mapService.calculateDistance(
        this.mapService.currentUserPosition.lat,
        this.mapService.currentUserPosition.lng,
        a.position.lat(),
        a.position.lng());
      const bDistance = this.mapService.calculateDistance(
        this.mapService.currentUserPosition.lat,
        this.mapService.currentUserPosition.lng,
        b.position.lat(),
        b.position.lng());
      return aDistance - bDistance;
    });
  }

  getInfoToDisplay(s: Station) {
    if (this.sortOption === 'Distance') {

      return (Math.round(this.mapService.calculateDistance(
        this.mapService.currentUserPosition.lat,
        this.mapService.currentUserPosition.lng,
        s.position.lat(),
        s.position.lng()
      ) * 100) / 100) + ' Km';
    } else if (this.sortOption === 'Prix') {
      if (this.selectedFuel) {
        const f = s.prix.find(s => s.nom === this.selectedFuel);
        if (f) {
          return f.valeur + ' €';
        } else {
          return 'Non dispo.'
        }
      } else {
        const sum = s.prix.map(p => parseFloat(p.valeur)).reduce((previousValue, currentValue) => previousValue += currentValue);
        return 'Moy.: ' + Math.round((sum / s.prix.length) * 100) / 100 + ' €';
      }
    }
  }
}
