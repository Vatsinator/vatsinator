import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { Airport } from './models/airport';
import { Pilot } from './models/pilot';
import { Marker, latLng, marker, Icon } from 'leaflet';
import { TooltipService } from './tooltip.service';

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
      model: 'C172',
      match: /C1(5|6|7)2/i,
      icon: L.icon({ iconUrl: '/assets/aircraft/C172.png', iconSize: [16, 16], tooltipAnchor: [0, -8] }),
    },
    {
      model: 'A320',
      match: /A3(18|19|20|21)/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/A320.png`, iconSize: [20, 20], tooltipAnchor: [0, -10] }),
    },
    {
      model: 'B737',
      match: /B73[123456789]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B737.png`, iconSize: [20, 20], tooltipAnchor: [0, -10] }),
    },
    {
      model: 'B777',
      match: /B77[2L3W89]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B777.png`, iconSize: [26, 26], tooltipAnchor: [0, -13] }),
    },
    {
      model: 'B747',
      match: /B74[12348RS]/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/B747.png`, iconSize: [30, 30], tooltipAnchor: [0, -15] }),
    },
    {
      model: 'A380',
      match: /A388/i,
      icon: L.icon({ iconUrl: `/assets/aircraft/A380.png`, iconSize: [32, 32], tooltipAnchor: [0, -16] }),
    },
  ];

  private default = this.aircraftIcons.find(a => a.model === 'B737');
  private airportIcon = L.icon({ iconUrl: '/assets/airport.png', iconSize: [20, 20], tooltipAnchor: [0, -10] });
  private airportIconAtc = L.icon({ iconUrl: '/assets/airport_atc.png', iconSize: [20, 20], tooltipAnchor: [0, -10] });

  constructor(
    private tooltipService: TooltipService,
  ) { }

  aircraft(pilot: Pilot): Marker {
    return marker(pilot.position, {
      icon: (this.aircraftIcons.find(a => pilot.aircraft.search(a.match) >= 0) || this.default).icon,
      rotationAngle: pilot.heading,
      rotationOrigin: 'center center',
      riseOnHover: true,
    })
    .bindTooltip(() => this.tooltipService.forFlight(pilot), { direction: 'top' });
  }

  airport(airport: Airport) {
    return marker(airport.position, {
      icon: airport.atcs.length > 0 ? this.airportIconAtc : this.airportIcon,
      riseOnHover: true,
    }).bindTooltip(airport.icao, { direction: 'top' });
  }

}
