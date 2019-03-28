export type ClientType = 'pilot' | 'atc';

export interface Client {
  callsign: string;
  cid: number;
  name: string;
  type: ClientType;
  position: { longitude: number; latitude: number; };
}
