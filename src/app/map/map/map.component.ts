import { Component } from '@angular/core';
import { Map, MapOptions } from 'leaflet';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options: MapOptions;

  constructor(
    private mapService: MapService,
  ) {
    this.options = this.mapService.mapOptions;
  }

  onMapReady(theMap: Map) {
    this.mapService.addMap(theMap);
  }

}
