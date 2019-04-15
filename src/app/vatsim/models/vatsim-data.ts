import { Client, Airport, Fir, Uir } from '.';

export interface VatsimData {
  general: {
    version: number;
    reload: number;
    update: Date;
    atisAllowMin: number;
    connectedClients: number;
  };

  clients: Client[];
  activeAirports: Airport[];
  firs: Fir[];
  uirs: Uir[];
}
