import { Client } from './client';
import { Airport } from './airport';

export interface Pilot extends Client {
  aircraft: string;
  heading: number;
  from: Airport | string;
  to: Airport | string;
  groundSpeed: number;
  flightPhase: 'departing' | 'airborne' | 'arrived';
}
