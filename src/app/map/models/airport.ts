import { Pilot } from './pilot';
import { Atc } from './atc';

export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  position: [number, number];
  alias: string;
  fir: string;

  inboundFlights: string[] | Pilot[];
  outboundFlights: string[] | Pilot[];
  atcs: string[] | Atc[];
}

export function isAirport(object: any): object is Airport {
  return typeof object === 'object' && 'icao' in object && 'name' in object && 'position' in object && 'fir' in object;
}

