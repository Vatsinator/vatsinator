import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';

interface AircraftIcon {
  model: string;
  match: RegExp;
  icon: L.Icon;
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private atcIcon = L.icon({
    iconUrl: '/assets/atc.png',
    iconSize: [24, 24],
    tooltipAnchor: [0, -12],
  });

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

  atc(position: L.LatLng): L.Marker {
    return L.marker(position, {
      icon: this.atcIcon,
      riseOnHover: true,
      zIndexOffset: 10,
    });
  }

  aircraft(position: L.LatLng, heading: number, aircraft: string): L.Marker {
    return L.marker(position, {
      icon: (this.aircraftIcons.find(a => aircraft.search(a.match) >= 0) || this.default).icon,
      rotationAngle: heading,
      rotationOrigin: 'center center',
      riseOnHover: true,
      zIndexOffset: 20,
    });
  }

}
