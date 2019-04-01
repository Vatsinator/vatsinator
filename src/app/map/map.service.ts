import { Injectable } from '@angular/core';
import { VatsimService } from './vatsim.service';
import { tileLayer, latLng, MapOptions, layerGroup, Map, polyline } from 'leaflet';
import { MarkerService } from './marker.service';
import { Pilot } from './models/pilot';
import { map } from 'rxjs/operators';
import { Airport } from './models/airport';
import { Subject, combineLatest, fromEvent } from 'rxjs';

function generateFlightLines(flight: Pilot, airports: Airport[]) {
  const lines = [];

  const dep = airports.find(ap => ap.icao === flight.from);
  if (dep) {
    // const points: L.LatLngTuple[] = [[ dep.lat, dep.lon ], [ pilot.position.latitude, pilot.position.longitude ]];
    const points = [latLng(dep.lat, dep.lon), latLng(flight.position.latitude, flight.position.longitude)];
    const line = polyline(points, {
      color: '#0374a4',
      weight: 2,
    });
    lines.push(line);
  }

  const arr = airports.find(ap => ap.icao === flight.to);
  if (arr) {
    const points = [latLng(arr.lat, arr.lon), latLng(flight.position.latitude, flight.position.longitude)];
    const line = polyline(points, {
      color: '#85a4a4',
      weight: 2,
      dashArray: [10, 8],
    });
    lines.push(line);
  }

  return lines;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly mapOptions: MapOptions = {
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

  private airports = layerGroup([], { pane: 'airpoprts' });
  private flights = layerGroup([], { pane: 'flights' });
  private lines = layerGroup([], { pane: 'lines' });

  private flightLines = new Subject<Pilot>();

  constructor(
    private vatsimService: VatsimService,
    private markerService: MarkerService,
  ) {
    this.vatsimService.airports.subscribe(airports => airports.forEach(ap => this.addAirport(ap)));

    this.vatsimService.clients.pipe(
      map(clients => clients.filter(c => c.type === 'pilot')),
      map(flights => flights.filter((f: Pilot) => f.flightPhase === 'airborne')),
    ).subscribe(flights => flights.forEach((f: Pilot) => this.addFlight(f)));

    combineLatest(this.flightLines, this.vatsimService.airports).pipe(
      map(([flight, airports]) => generateFlightLines(flight, airports))
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));
  }

  addMap(theMap: Map) {
    // https://leafletjs.com/reference-1.4.0.html#map-pane
    theMap.createPane('lines').style.zIndex = '510';
    theMap.createPane('airports').style.zIndex = '520';
    theMap.createPane('flights').style.zIndex = '530';

    this.airports.addTo(theMap);
    this.flights.addTo(theMap);
    this.lines.addTo(theMap);
  }

  /** Adds flight marker */
  addFlight(pilot: Pilot) {
    const marker = this.markerService.aircraft(pilot);
    fromEvent(marker, 'mouseover').subscribe(() => this.showFlightLines(pilot));
    fromEvent(marker, 'mouseout').subscribe(() => this.clearLines());
    marker.addTo(this.flights);
  }

  /** Shows flight lines */
  showFlightLines(pilot: Pilot) {
    this.flightLines.next(pilot);
  }

  /** Adds airport marker */
  addAirport(airport: Airport) {
    this.markerService.airport(airport).addTo(this.airports);
  }

  /** Clear all lines */
  clearLines() {
    this.lines.clearLayers();
  }

}
