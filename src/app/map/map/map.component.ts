import { Component } from '@angular/core';
import { tileLayer, latLng, Map } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { AircraftIconService } from '../aircraft-icon.service';
import { VatsimService } from '../vatsim.service';
import { Client } from '../models/client';
import { Pilot } from '../models/pilot';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options: L.MapOptions = {
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
    maxBounds: [[-90, -180], [90, 180]],
    preferCanvas: true,
  };

  constructor(
    private aircraftIconService: AircraftIconService,
    private vatsimService: VatsimService,
  ) { }

  onMapReady(theMap: Map) {
    this.vatsimService.clients.pipe(
      map(clients => clients.filter(c => c.type === 'pilot')),
      map(clients => clients.map(c => this.createMarker(c))),
    ).subscribe(markers => markers.forEach(marker => marker.addTo(theMap)));
  }

  private createMarker(client: Client): L.Marker<any> {
    if (client.type === 'pilot') {
      const pilot = client as Pilot;
      return L.marker(latLng(pilot.position.latitude, pilot.position.longitude), {
        icon: this.aircraftIconService.forIcao(pilot.aircraft),
        rotationAngle: pilot.heading,
        rotationOrigin: 'center center',
        riseOnHover: true,
      })
      .bindTooltip(pilot.callsign, { offset: [0, -12], direction: 'top' });
    }
  }

}
