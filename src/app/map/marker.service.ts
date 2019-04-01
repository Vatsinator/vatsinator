import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { Airport } from './models/airport';
import { Pilot } from './models/pilot';
import { Marker, latLng, circleMarker, marker, Icon } from 'leaflet';

interface AircraftIcon {
  model: string;
  match: RegExp;
  icon: Icon;
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private aircraftIcons: AircraftIcon[] = [
    {
      model: 'A320',
      match: /A3(18|19|20|21)/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/A320.png`, iconSize: [20, 20], tooltipAnchor: [0, -10] })
    },
    {
      model: 'B737',
      match: /B73[123456789]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B737.png`, iconSize: [20, 20], tooltipAnchor: [0, -10] })
    },
    {
      model: 'B777',
      match: /B77[2L3W89]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B777.png`, iconSize: [26, 26], tooltipAnchor: [0, -13] })
    },
    {
      model: 'B747',
      match: /B74[12348RS]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B747.png`, iconSize: [30, 30], tooltipAnchor: [0, -15] })
    },
    {
      model: 'A380',
      match: /A388/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/A380.png`, iconSize: [32, 32], tooltipAnchor: [0, -16] })
    },
  ];

  private default = this.aircraftIcons.find(a => a.model === 'B737');

  aircraft(pilot: Pilot): Marker {
    return marker(latLng(pilot.position.latitude, pilot.position.longitude), {
      icon: (this.aircraftIcons.find(a => pilot.aircraft.search(a.match) >= 0) || this.default).icon,
      rotationAngle: pilot.heading,
      rotationOrigin: 'center center',
      riseOnHover: true,
      zIndexOffset: 20,
    })
    .bindTooltip(pilot.callsign, { direction: 'top' });
  }

  airport(airport: Airport) {
    return circleMarker(latLng(airport.lat, airport.lon), {
      radius: 5,
      color: '#ff0000',
      fill: true,
      fillOpacity: 1,
    }).bindTooltip(airport.icao, {
      direction: 'top',
      offset: [0, -10],
    });
  }

}
