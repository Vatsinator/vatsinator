export interface Fir {
  icao: string;
  name: string;
  country: string;
  oceanic: boolean;
  border: [number, number][][];
  labelPosition: [number, number];
}
