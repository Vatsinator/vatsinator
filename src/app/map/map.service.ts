import { Injectable } from '@angular/core';
import { VatsimService } from './vatsim.service';
import { latLng, layerGroup, Map, polyline, Polyline, LatLng, polygon, divIcon, marker } from 'leaflet';
import { MarkerService } from './marker.service';
import { Pilot } from './models/pilot';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Airport, isAirport } from './models/airport';
import { Subject, fromEvent } from 'rxjs';
import { Client } from './models/client';
import { Fir } from '../vatsim/models/fir';

/** Create a solid line */
function makeOutboundLine(points: LatLng[]) {
  return polyline(points, { color: '#0374a4', weight: 2 });
}

/** Create dashed line */
function makeInboundLine(points: LatLng[]) {
  return polyline(points, { color: '#85a4a4', weight: 2, dashArray: [10, 8] });
}

function generateFlightLines(flight: Pilot): Polyline[] {
  const lines = [];

  if (isAirport(flight.from)) {
    const points = [latLng(flight.from.position), latLng(flight.position)];
    lines.push(makeOutboundLine(points));
  }

  if (isAirport(flight.to)) {
    const points = [latLng(flight.to.position), latLng(flight.position)];
    lines.push(makeInboundLine(points));
  }

  return lines;
}

function generateAirportLines(airport: Airport, clients: Client[]): Polyline[] {
  return [
    ...airport.inboundFlights.map(callsign => {
      const flight = clients.find(f => f.callsign === callsign);
      if (flight) {
        const points = [latLng(airport.position), latLng(flight.position)];
        return makeInboundLine(points);
      }
    }),
    ...airport.outboundFlights.map(callsign => {
      const flight = clients.find(f => f.callsign === callsign);
      if (flight) {
        const points = [latLng(airport.position), latLng(flight.position)];
        return makeOutboundLine(points);
      }
    }),
  ];
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private firs = layerGroup([], { pane: 'firs' });
  private airports = layerGroup([], { pane: 'airports' });
  private flights = layerGroup([], { pane: 'flights' });
  private lines = layerGroup([], { pane: 'lines' });

  private flightLines = new Subject<Pilot>();
  private airportLines = new Subject<Airport>();

  constructor(
    private vatsimService: VatsimService,
    private markerService: MarkerService,
  ) {
    this.vatsimService.airports.pipe(
      tap(() => this.airports.clearLayers()),
    ).subscribe(airports => airports.forEach(ap => this.addAirport(ap)));

    this.vatsimService.clients.pipe(
      map(clients => clients.filter(c => c.type === 'pilot')),
      map(flights => flights.filter((f: Pilot) => f.flightPhase === 'airborne')),
      tap(() => this.flights.clearLayers()),
    ).subscribe(flights => flights.forEach((f: Pilot) => this.addFlight(f)));

    this.vatsimService.firs.pipe(
      tap(() => this.firs.clearLayers()),
    ).subscribe(firs => firs.forEach(fir => this.addFir(fir)));

    this.flightLines.pipe(
      map(flight => generateFlightLines(flight)),
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));

    this.airportLines.pipe(
      withLatestFrom(this.vatsimService.clients),
      map(([airport, clients]) => generateAirportLines(airport, clients)),
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));
  }

  addMap(theMap: Map) {
    // https://leafletjs.com/reference-1.4.0.html#map-pane
    theMap.createPane('firs').style.zIndex = '510';
    theMap.createPane('lines').style.zIndex = '520';
    theMap.createPane('airports').style.zIndex = '530';
    theMap.createPane('flights').style.zIndex = '540';

    this.firs.addTo(theMap);
    this.airports.addTo(theMap);
    this.flights.addTo(theMap);
    this.lines.addTo(theMap);
  }

  addFlight(pilot: Pilot) {
    const aircraftMarker = this.markerService.aircraft(pilot);
    fromEvent(aircraftMarker, 'tooltipopen').subscribe(() => this.showFlightLines(pilot));
    fromEvent(aircraftMarker, 'tooltipclose').subscribe(() => this.clearLines());
    aircraftMarker.addTo(this.flights);
  }

  showFlightLines(pilot: Pilot) {
    this.flightLines.next(pilot);
  }

  addAirport(airport: Airport) {
    const airportMarker = this.markerService.airport(airport);
    fromEvent(airportMarker, 'tooltipopen').subscribe(() => this.showAirportLines(airport));
    fromEvent(airportMarker, 'tooltipclose').subscribe(() => this.clearLines());
    airportMarker.addTo(this.airports);
  }

  showAirportLines(airport: Airport) {
    this.airportLines.next(airport);
  }

  /** Clear all lines */
  clearLines() {
    this.lines.clearLayers();
  }

  addFir(fir: Fir) {
    polygon(fir.boundaries, {
      color: '#b02020',
      fillColor: '#b02020',
      weight: 2,
      interactive: false,
    })
    .addTo(this.firs);

    const label = divIcon({ html: fir.icao, className: 'vatsim-fir-label-active' });
    marker(fir.labelPosition, { icon: label })
      .bindTooltip(`${fir.name}, ${fir.country}`, { direction: 'center' })
      .addTo(this.firs);
  }

}
