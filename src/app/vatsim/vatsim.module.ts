import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatsimStatusComponent } from './vatsim-status/vatsim-status.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { VatsimEffects } from './vatsim.effects';

@NgModule({
  declarations: [
    VatsimStatusComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('vatsim', reducers),
    EffectsModule.forFeature([VatsimEffects]),
  ],
  exports: [
    VatsimStatusComponent,
  ]
})

@NgModule({ })
export class VatsimModule { }
