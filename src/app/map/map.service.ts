import { Injectable } from '@angular/core';
import { VatsimService } from './vatsim.service';
import { tileLayer, latLng, MapOptions, layerGroup, Map, polyline, Polyline, LatLng } from 'leaflet';
import { MarkerService } from './marker.service';
import { Pilot } from './models/pilot';
import { map } from 'rxjs/operators';
import { Airport } from './models/airport';
import { Subject, combineLatest, fromEvent } from 'rxjs';
import { Client } from './models/client';

/** Create a solid line */
function makeOutboundLine(points: LatLng[]) {
  return polyline(points, { color: '#0374a4', weight: 2 });
}

/** Create dashed line */
function makeInboundLine(points: LatLng[]) {
  return polyline(points, { color: '#85a4a4', weight: 2, dashArray: [10, 8] });
}

function generateFlightLines(flight: Pilot, airports: Airport[]): Polyline[] {
  const lines = [];

  const dep = airports.find(ap => ap.icao === flight.from);
  if (dep) {
    // const points: L.LatLngTuple[] = [[ dep.lat, dep.lon ], [ pilot.position.latitude, pilot.position.longitude ]];
    const points = [latLng(dep.lat, dep.lon), latLng(flight.position.latitude, flight.position.longitude)];
    lines.push(makeOutboundLine(points));
  }

  const arr = airports.find(ap => ap.icao === flight.to);
  if (arr) {
    const points = [latLng(arr.lat, arr.lon), latLng(flight.position.latitude, flight.position.longitude)];
    lines.push(makeInboundLine(points));
  }

  return lines;
}

function generateAirportLines(airport: Airport, clients: Client[]): Polyline[] {
  return [
    ...airport.inboundFlights.map(callsign => {
      const flight = clients.find(f => f.callsign === callsign);
      if (flight) {
        const points = [latLng(airport.lat, airport.lon), latLng(flight.position.latitude, flight.position.longitude)];
        return makeInboundLine(points);
      }
    }),
    ...airport.outboundFlights.map(callsign => {
      const flight = clients.find(f => f.callsign === callsign);
      if (flight) {
        const points = [latLng(airport.lat, airport.lon), latLng(flight.position.latitude, flight.position.longitude)];
        return makeOutboundLine(points);
      }
    }),
  ];
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private airports = layerGroup([], { pane: 'airpoprts' });
  private flights = layerGroup([], { pane: 'flights' });
  private lines = layerGroup([], { pane: 'lines' });

  private flightLines = new Subject<Pilot>();
  private airportLines = new Subject<Airport>();

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
      map(([flight, airports]) => generateFlightLines(flight, airports)),
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));

    combineLatest(this.airportLines, this.vatsimService.clients).pipe(
      map(([airport, clients]) => generateAirportLines(airport, clients)),
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

  addFlight(pilot: Pilot) {
    const marker = this.markerService.aircraft(pilot);
    fromEvent(marker, 'mouseover').subscribe(() => this.showFlightLines(pilot));
    fromEvent(marker, 'mouseout').subscribe(() => this.clearLines());
    marker.addTo(this.flights);
  }

  showFlightLines(pilot: Pilot) {
    this.flightLines.next(pilot);
  }

  addAirport(airport: Airport) {
    const marker = this.markerService.airport(airport);
    fromEvent(marker, 'mouseover').subscribe(() => this.showAirportLines(airport));
    fromEvent(marker, 'mouseout').subscribe(() => this.clearLines());
    marker.addTo(this.airports);
  }

  showAirportLines(airport: Airport) {
    this.airportLines.next(airport);
  }

  /** Clear all lines */
  clearLines() {
    this.lines.clearLayers();
  }

}
