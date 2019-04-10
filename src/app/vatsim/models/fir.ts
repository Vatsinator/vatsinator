import { Atc } from '../../map/models/atc';

export interface Fir {
  icao: string;
  name: string;
  prefix: string[];
  alias: string[];
  boundaries: [number, number][][];
  country?: string;
  labelPosition: [number, number];
  oceanic: boolean;

  atcs?: Atc[];
}
