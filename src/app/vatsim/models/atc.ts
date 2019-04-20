import { Client } from './client';

export interface Atc extends Client {
  frequency: string;
  rating: number;
  facility: string;

  airport?: string;
  fir?: string;
  uir?: string;
}

export function isAtc(client: Client): client is Atc {
  return client.type === 'atc';
}
