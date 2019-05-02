import { Injectable } from '@angular/core';
import { latLng, layerGroup, Map, polyline, LatLng, polygon, circle } from 'leaflet';
import { MarkerService } from './marker.service';
import { Pilot, isPilot } from '@app/vatsim/models/pilot';
import { map, filter, first } from 'rxjs/operators';
import { Airport, Fir, VatsimData } from '@app/vatsim/models';
import { Store, select } from '@ngrx/store';
import { RefreshVatsimData } from '@app/vatsim/vatsim.actions';
import { vatsimData, airport, pilots } from '@app/vatsim/vatsim.selectors';
import { fromEvent, zip, ReplaySubject, Subject } from 'rxjs';
import { SidebarSelectItem, SidebarOpen } from '@app/sidebar/sidebar.actions';

/** Create a solid line */
function makeOutboundLine(points: LatLng[]) {
  return polyline(points, { color: '#0374a4', weight: 2 });
}

/** Create dashed line */
function makeInboundLine(points: LatLng[]) {
  return polyline(points, { color: '#85a4a4', weight: 2, dashArray: [10, 8] });
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private firs = layerGroup([], { pane: 'firs' });
  private tmas = layerGroup([], { pane: 'tmas' });
  private airports = layerGroup([], { pane: 'airports' });
  private flights = layerGroup([], { pane: 'flights' });
  private lines = layerGroup([], { pane: 'lines' });
  private mapSource = new ReplaySubject<Map>(1);

  readonly map = this.mapSource.asObservable();

  constructor(
    private store: Store<{ vatsimData: VatsimData }>,
    private markerService: MarkerService,
  ) {
    this.store.pipe(
      select(vatsimData),
    ).subscribe((data: VatsimData) => {
      this.firs.clearLayers();
      data.firs.forEach(fir => this.addFir(fir));

      this.airports.clearLayers();
      this.tmas.clearLayers();
      data.activeAirports.forEach(ap => this.addAirport(ap));

      this.flights.clearLayers();
      data.clients.filter(c => isPilot(c) && c.flightPhase === 'airborne').forEach((p: Pilot) => this.addFlight(p));

      setTimeout(() => this.refresh(), data.general.reload * 60 * 1000);
    });

    this.refresh();
  }

  addMap(theMap: Map) {
    this.mapSource.next(theMap);

    // https://leafletjs.com/reference-1.4.0.html#map-pane
    theMap.createPane('firs').style.zIndex = '510';
    theMap.createPane('tmas').style.zIndex = '520';
    theMap.createPane('lines').style.zIndex = '530';
    theMap.createPane('airports').style.zIndex = '540';
    theMap.createPane('flights').style.zIndex = '550';

    this.firs.addTo(theMap);
    this.tmas.addTo(theMap);
    this.airports.addTo(theMap);
    this.flights.addTo(theMap);
    this.lines.addTo(theMap);
  }

  addFlight(pilot: Pilot) {
    const aircraftMarker = this.markerService.aircraft(pilot);
    fromEvent(aircraftMarker, 'tooltipopen').subscribe(() => this.showFlightLines(pilot));
    fromEvent(aircraftMarker, 'tooltipclose').subscribe(() => this.clearLines());
    fromEvent(aircraftMarker, 'click').subscribe(() => this.selectItem(pilot));
    aircraftMarker.addTo(this.flights);
  }

  showFlightLines(flight: Pilot) {
    const outboundLine = this.store.pipe(
      select(airport, { icao: flight.from }),
      filter(ap => !!ap),
      map(ap => makeOutboundLine([latLng(ap.position), latLng(flight.position)])),
    );

    const inboundLine = this.store.pipe(
      select(airport, { icao: flight.to }),
      filter(ap => !!ap),
      map(ap => makeInboundLine([latLng(ap.position), latLng(flight.position)])),
    );

    zip(outboundLine, inboundLine).pipe(
      first(),
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));
  }

  addAirport(theAirport: Airport) {
    const airportMarker = this.markerService.airport(theAirport);
    fromEvent(airportMarker, 'tooltipopen').subscribe(() => this.showAirportLines(theAirport));
    fromEvent(airportMarker, 'tooltipclose').subscribe(() => this.clearLines());
    // fromEvent(airportMarker, 'click').subscribe(() => this.selectedItemSource.next(airport));
    airportMarker.addTo(this.airports);

    // draw TMA circle
    if (theAirport.atcs.filter(callsign => callsign.match(/_APP$/)).length > 0) {
      circle(latLng(theAirport.position), {
        radius: 50000,
        fillColor: '#0059ff',
        fillOpacity: 0.2,
        stroke: false,
        interactive: false,
      }).addTo(this.tmas);
    }
  }

  showAirportLines(theAirport: Airport) {
    const inbound = this.store.pipe(
      select(pilots),
      map(allPilots => allPilots.filter(pilot => pilot.to === theAirport.icao)),
      map(flights => flights.map(f => makeInboundLine([latLng(theAirport.position), latLng(f.position)]))),
    );

    const outbound = this.store.pipe(
      select(pilots),
      map(allPilots => allPilots.filter(pilot => pilot.from === theAirport.icao)),
      map(flights => flights.map(f => makeOutboundLine([latLng(theAirport.position), latLng(f.position)]))),
    );

    zip(inbound, outbound).pipe(
      map(([inboundLines, outboundLines]) => [...inboundLines, ...outboundLines]),
      first(),
    ).subscribe(lines => lines.forEach(line => line.addTo(this.lines)));
  }

  /** Clear all lines */
  clearLines() {
    this.lines.clearLayers();
  }

  addFir(fir: Fir) {
    // fixme: move these color to config?
    const color = fir.hasUirAtcsOnly ? '#8fbecf' : '#b02020';
    polygon(fir.boundaries, {
      color, fillColor: color,
      opacity: 0.2,
      weight: 1,
      interactive: false,
    })
    .addTo(this.firs);

    this.markerService.fir(fir).addTo(this.firs);
  }

  private refresh() {
    this.store.dispatch(new RefreshVatsimData());
  }

  private selectItem(item: Pilot) {
    this.store.dispatch(new SidebarSelectItem({ item: { callsign: item.callsign }}));
    this.store.dispatch(new SidebarOpen());
  }

}
