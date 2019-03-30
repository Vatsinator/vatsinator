import { Component } from '@angular/core';
import { tileLayer, latLng, Map } from 'leaflet';
import * as L from 'leaflet';
import { VatsimService } from '../vatsim.service';
import { Client } from '../models/client';
import { Pilot } from '../models/pilot';
import { map } from 'rxjs/operators';
import { Atc } from '../models/atc';
import { MarkerService } from '../marker.service';

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
    private vatsimService: VatsimService,
    private markerService: MarkerService,
  ) { }

  onMapReady(theMap: Map) {
    this.vatsimService.clients.pipe(
      map(clients => clients.filter(c => c.type === 'pilot')),
      map(clients => clients.filter(c => (c as Pilot).groundSpeed > 50)),
      map(clients => clients.map(c => this.createMarker(c))),
    ).subscribe(markers => markers.filter(m => !!m).forEach(marker => marker.addTo(theMap)));

    this.vatsimService.airports.pipe(
      map(airports => airports.map(a => this.markerService.airport(latLng(a.lat, a.lon)).bindTooltip(a.icao, { direction: 'top' }))),
    ).subscribe(markers => markers.forEach(marker => marker.addTo(theMap)));
  }

  private createMarker(client: Client): L.Marker<any> {
    if (client.type === 'pilot') {
      const pilot = client as Pilot;
      return this.markerService
        .aircraft(latLng(pilot.position.latitude, pilot.position.longitude), pilot.heading, pilot.aircraft)
        .bindTooltip(pilot.callsign, { direction: 'top' });
    }
  }

}
