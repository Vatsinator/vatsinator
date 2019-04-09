export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  position: [number, number];
  alias: string;
  fir: string;

  inboundFlights: string[];
  outboundFlights: string[];
  atcs: string[];
}

export function isAirport(object: any): object is Airport {
  return typeof object === 'object' && 'icao' in object && 'name' in object && 'position' in object && 'fir' in object;
}

