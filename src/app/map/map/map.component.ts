import { Component } from '@angular/core';
import { tileLayer, latLng, Map } from 'leaflet';
import * as L from 'leaflet';
import { VatsimService } from '../vatsim.service';
import { Pilot } from '../models/pilot';
import { map, switchMap } from 'rxjs/operators';
import { MarkerService } from '../marker.service';
import { fromEvent, Subject } from 'rxjs';

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

  private lines = new Subject<L.Layer>();
  private clearLines = new Subject<void>();

  constructor(
    private vatsimService: VatsimService,
    private markerService: MarkerService,
  ) { }

  onMapReady(theMap: Map) {
    this.vatsimService.clients.pipe(
      map(clients => clients.filter(c => c.type === 'pilot')),
      map(clients => clients.filter((c: Pilot) => c.flightPhase === 'airborne')),
      map(clients => clients.map((c: Pilot) => this.createMarker(c))),
    ).subscribe(markers => markers.filter(m => !!m).forEach(marker => marker.addTo(theMap)));

    this.vatsimService.airports.pipe(
      map(airports => airports.map(a => this.markerService.airport(a))),
    ).subscribe(markers => markers.forEach(marker => marker.addTo(theMap)));

    const layer = L.layerGroup();
    this.lines.subscribe(l => l.addTo(layer));
    this.clearLines.subscribe(() => layer.clearLayers());
    layer.addTo(theMap);
  }

  private createMarker(pilot: Pilot): L.Marker<any> {
    const marker = this.markerService.aircraft(pilot);

    fromEvent(marker, 'mouseover').pipe(
      switchMap(() => this.vatsimService.airports),
    ).subscribe(airports => {
      const dep = airports.find(ap => ap.icao === pilot.from);
      if (dep) {
        const points: L.LatLngTuple[] = [[ dep.lat, dep.lon ], [ pilot.position.latitude, pilot.position.longitude ]];
        const line = L.polyline(points, {
          color: '#0374a4',
          weight: 2,
        });
        this.lines.next(line);
      }

      const arr = airports.find(ap => ap.icao === pilot.to);
      if (arr) {
        const points: L.LatLngTuple[] = [[ arr.lat, arr.lon ], [ pilot.position.latitude, pilot.position.longitude ]];
        const line = L.polyline(points, {
          color: '#85a4a4',
          weight: 2,
          dashArray: [10, 8],
        });
        this.lines.next(line);
      }
    });

    fromEvent(marker, 'mouseout').subscribe(() => this.clearLines.next());

    return marker;
  }

}
