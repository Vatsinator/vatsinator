import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { ReplaySubject, zip } from 'rxjs';
import { Client } from './models/client';
import { HttpClient } from '@angular/common/http';
import { Airport } from './models/airport';
import { Fir } from '../vatsim/models/fir';
import { Atc } from './models/atc';
import { FirListService } from '../vatsim/fir-list.service';
import { defaultIfEmpty } from 'rxjs/operators';

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
  readonly general = this.generalSource.asObservable();

  private clientsSource = new ReplaySubject<Client[]>(1);
  readonly clients = this.clientsSource.asObservable();

  private airportsSource = new ReplaySubject<Airport[]>(1);
  readonly airports = this.airportsSource.asObservable();

  private firsSource = new ReplaySubject<Fir[]>(1);
  readonly firs = this.firsSource.asObservable();

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

      const firs = data.clients
        .filter(client => client.type === 'atc')
        .filter((atc: Atc) => !!atc.fir)
        .map((atc: Atc) => atc.fir);
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
