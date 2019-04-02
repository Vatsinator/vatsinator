import { Component } from '@angular/core';
import { Map, MapOptions, tileLayer, LeafletEvent } from 'leaflet';
import { MapService } from '../map.service';
import { MapViewService } from '../map-view.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        // tslint:disable-next-line:max-line-length
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }),
    ],
    zoom: this.mapViewService.zoom,
    center: this.mapViewService.center,
    preferCanvas: true,
  };

  constructor(
    private mapService: MapService,
    private mapViewService: MapViewService,
  ) { }

  onMapReady(theMap: Map) {
    this.mapService.addMap(theMap);
  }

  onMoveEnd(event: LeafletEvent) {
    const map = event.target as Map;
    this.mapViewService.center = map.getCenter();
    this.mapViewService.save();
  }

  onZoomEnd(event: LeafletEvent) {
    const map = event.target as Map;
    this.mapViewService.zoom = map.getZoom();
    this.mapViewService.save();
  }

}
