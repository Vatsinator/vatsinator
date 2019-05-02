export interface SelectableFlight {
  callsign: string;
}

export interface SelectableAirport {
  icao: string;
}

export type Selectable = SelectableFlight | SelectableAirport;
