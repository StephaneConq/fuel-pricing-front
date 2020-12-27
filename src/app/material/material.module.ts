import { NgModule } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";

const modules = [
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatSidenavModule,
  MatBottomSheetModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatListModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
