import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { ReplaySubject, zip, Observable } from 'rxjs';
import { Client } from './models/client';
import { HttpClient } from '@angular/common/http';
import { Airport } from './models/airport';
import { Fir } from '../vatsim/models/fir';
import { Atc, isAtc } from './models/atc';
import { FirListService } from '../vatsim/fir-list.service';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { Pilot, isPilot } from './models/pilot';

interface VatsimDataGeneral {
  version: number;
  reload: number;
  update: Date;
  atisAllowMin: number;
  connectedClients: number;
}

interface VatsimData {
  general: VatsimDataGeneral;
  clients: Client[];
  activeAirports: Airport[];
}

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  private generalSource = new ReplaySubject<VatsimDataGeneral>(1);
  private clientsSource = new ReplaySubject<Client[]>(1);
  private airportsSource = new ReplaySubject<Airport[]>(1);
  private firsSource = new ReplaySubject<Fir[]>(1);

  readonly general = this.generalSource.asObservable();

  readonly clients: Observable<Client[]> = zip(
    this.clientsSource,
    this.airportsSource,
  ).pipe(
    map(([clients, airports]) => {
      return clients.map(client => {
        if (isPilot(client)) {
          const from = airports.find(ap => ap.icao === client.from) || client.from;
          const to = airports.find(ap => ap.icao === client.to) || client.to;
          return { ...client, from, to };
        }  else {
          return client;
        }
      });
    }),
  );

  readonly airports: Observable<Airport[]> = zip(
    this.airportsSource,
    this.clientsSource,
  ).pipe(
    map(([airports, clients]) => {
      return airports.map(airport => {
        return { ...airport,
          inboundFlights: clients.filter(client => isPilot(client) && client.to === airport.icao) as Pilot[],
          outboundFlights: clients.filter(client => isPilot(client) && client.from === airport.icao) as Pilot[],
          atcs: clients.filter(client => isAtc(client) && client.airport === airport.icao) as Atc[],
        };
      });
    }),
  );

  readonly firs: Observable<Fir[]> = zip(
    this.firsSource,
    this.clientsSource,
  ).pipe(
    map(([firs, clients]) => {
      return firs.map(fir => {
        return { ...fir,
          atcs: clients.filter(client => isAtc(client) && client.fir === fir.icao) as Atc[]
        };
      });
    }),
  );

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private firListService: FirListService,
  ) {
   this.refresh();
  }

  refresh() {
    this.http.get<VatsimData>(`${this.apiUrl}/vatsim/data`).subscribe(data => {
      console.log(`Data refreshed (${data.general.connectedClients} clients)`);

      this.generalSource.next(data.general);
      this.clientsSource.next(data.clients);
      this.airportsSource.next(data.activeAirports);

      const firs = [...new Set(data.clients
        .filter(client => client.type === 'atc')
        .filter((atc: Atc) => !!atc.fir)
        .map((atc: Atc) => atc.fir))];
      this.fetchFirs(firs);

      console.log(`Next update in ${data.general.reload} minutes`);
      setTimeout(() => this.refresh(), data.general.reload * 60 * 1000);
    });
  }

  private fetchFirs(icaos: string[]) {
    zip(...icaos.map(icao => this.firListService.fir(icao))).pipe(
      defaultIfEmpty([])
    ).subscribe(firs => this.firsSource.next(firs));
  }

}
