import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatsimStatusComponent } from './vatsim-status/vatsim-status.component';

@NgModule({
  declarations: [
    VatsimStatusComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VatsimStatusComponent,
  ]
})
export class VatsimModule { }
