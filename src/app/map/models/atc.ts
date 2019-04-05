import { Client } from './client';

export interface Atc extends Client {
  frequency: string;
  rating: number;
  facility: string;

  airport?: string;
  fir?: string;
}
