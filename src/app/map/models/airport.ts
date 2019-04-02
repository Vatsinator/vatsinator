export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  state: string;
  country: string;
  elevation: number;
  lat: number;
  lon: number;
  tz: string;

  inboundFlights: string[];
  outboundFlights: string[];
  atcs: string[];
}

