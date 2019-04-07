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

