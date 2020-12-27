import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Station} from "../../models/station";
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationDetailsComponent implements OnInit {

  @Input() selectedStation: Station;
  @Output() previousEvent = new EventEmitter();

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: Station,
              private mapService: MapService,
              public bottomSheetRef: MatBottomSheetRef<StationDetailsComponent>) { }

  ngOnInit(): void {
    if (this.selectedStation) {
      this.data = this.selectedStation;
    }
  }

  getServices() {
    return this.data.services.join(', ');
  }

  displayHours() {
    return !this.data.horaires || (typeof this.data.horaires === 'object' && this.data.horaires.length > 0);
  }

  previous() {
    this.previousEvent.emit();
    this.mapService.mapMovementBS.next(null);
  }

}
