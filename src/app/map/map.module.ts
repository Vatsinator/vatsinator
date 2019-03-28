import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    HttpClientModule,
  ],
  declarations: [
    MapComponent,
  ],
  exports: [
    MapComponent,
  ]
})
export class MapModule { }
