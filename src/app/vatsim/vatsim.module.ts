import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { VatsimEffects } from './vatsim.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('vatsim', reducers),
    EffectsModule.forFeature([VatsimEffects]),
  ],
})

@NgModule({ })
export class VatsimModule { }
