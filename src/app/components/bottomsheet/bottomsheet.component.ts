import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Station } from 'src/app/models/station';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss'],
})
export class BottomsheetComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public station: Station) {
    console.log('station', station);
  }
}
