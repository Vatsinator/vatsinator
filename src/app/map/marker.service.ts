import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private atcIcon = L.icon({
    iconUrl: '/assets/atc.png',
    iconSize: [24, 24],
    tooltipAnchor: [0, -12],
  });

  private aircrafts = [ 'B737' ];
  private aircraftIcons: L.Icon[] = this.aircrafts.map(a => L.icon({
    iconUrl: `/assets/aircraft/${a}.png`,
    iconSize: [24, 24],
    tooltipAnchor: [0, -12],
  }));

  atc(position: L.LatLng): L.Marker {
    return L.marker(position, {
      icon: this.atcIcon,
      riseOnHover: true,
      zIndexOffset: 10,
    });
  }

  aircraft(position: L.LatLng, heading: number, aircraft: string): L.Marker {
    return L.marker(position, {
      icon: this.aircraftIcons[Math.floor(Math.random() * this.aircraftIcons.length)],
      rotationAngle: heading,
      rotationOrigin: 'center center',
      riseOnHover: true,
      zIndexOffset: 20,
    });
  }

}
