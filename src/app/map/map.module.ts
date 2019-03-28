import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
  ],
  declarations: [
    MapComponent,
  ],
  exports: [
    MapComponent,
  ]
})
export class MapModule { }
