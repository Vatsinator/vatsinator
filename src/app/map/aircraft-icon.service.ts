import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class AircraftIconService {

  private aircraft = L.icon({
    iconUrl: '/assets/2j.svg',
    iconSize: [24, 24],
  });

  forIcao(icao: string) {
    return this.aircraft;
  }

}
