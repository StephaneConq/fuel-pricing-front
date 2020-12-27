import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {FilterService} from "../../services/filter.service";

@Component({
  selector: 'app-station-filter',
  templateUrl: './station-filter.component.html',
  styleUrls: ['./station-filter.component.scss']
})
export class StationFilterComponent implements OnInit {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<StationFilterComponent>,
    public filterService: FilterService
  ) { }

  ngOnInit(): void {
  }

  reset() {
    this.filterService.filters.services = [];
    this.filterService.filters.fuels = [];
  }

}
