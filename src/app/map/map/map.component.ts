import { Component } from '@angular/core';
import { tileLayer, latLng, Map } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { AircraftIconService } from '../aircraft-icon.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options = {
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        // tslint:disable-next-line:max-line-length
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }),
    ],
    zoom: 3,
    center: latLng(0, 0),
  };

  constructor(
    private aircraftIconService: AircraftIconService,
  ) { }

  onMapReady(map: Map) {
    L.marker(latLng(0, 0), {
      icon: this.aircraftIconService.forIcao('B738'),
      rotationAngle: 45,
      rotationOrigin: 'center center',
      // title: 'SPVAT',
      riseOnHover: true,
    }).addTo(map).bindTooltip('SPVAT');
  }

}
