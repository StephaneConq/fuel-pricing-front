import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';

const modules = [MatProgressBarModule, MatBottomSheetModule, MatCardModule];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
