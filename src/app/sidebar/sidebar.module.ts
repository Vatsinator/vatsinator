import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MapModule } from '@app/map/map.module';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './sidebar.reducer';

@NgModule({
  declarations: [
    SidebarComponent,
    FlightDetailsComponent,
  ],
  imports: [
    CommonModule,
    MapModule,
    StoreModule.forFeature('sidebar', reducer),
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SidebarModule { }
