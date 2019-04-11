import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { AirportPipe } from './airport.pipe';
import { AirportTooltipComponent } from './airport-tooltip/airport-tooltip.component';
import { FirTooltipComponent } from './fir-tooltip/fir-tooltip.component';
import { VatsimModule } from '@app/vatsim/vatsim.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,

    SharedModule,
    VatsimModule,
  ],
  declarations: [
    MapComponent,
    FlightTooltipComponent,
    AirportPipe,
    AirportTooltipComponent,
    FirTooltipComponent,
  ],
  exports: [
    MapComponent,
  ],
  entryComponents: [
    FlightTooltipComponent,
    AirportTooltipComponent,
    FirTooltipComponent,
  ]
})
export class MapModule { }
