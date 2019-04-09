import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { VatsimStatusComponent } from './vatsim-status/vatsim-status.component';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { AirportPipe } from './airport.pipe';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
  ],
  declarations: [
    MapComponent,
    VatsimStatusComponent,
    FlightTooltipComponent,
    AirportPipe,
  ],
  exports: [
    MapComponent,
  ],
  entryComponents: [
    FlightTooltipComponent,
  ]
})
export class MapModule { }
