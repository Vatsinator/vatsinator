import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { ReplaySubject, zip } from 'rxjs';
import { VatsimData, Fir, isAtc } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, defaultIfEmpty, map, tap } from 'rxjs/operators';
import { Uir } from './models/uir';

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  private dataSource = new ReplaySubject<VatsimData & { firs: Fir[] }>(1);
  readonly data = this.dataSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    setInterval(() => this.refresh(), 2 * 60 * 1000);
    this.refresh();
  }

  refresh() {
    this.http.get<VatsimData>(`${this.apiUrl}/vatsim/data`).pipe(
      switchMap(response => this.resolveFirs(response)),
    ).subscribe(data => this.dataSource.next(data));
  }

  private resolveFirs(response: VatsimData) {
    const uirs = [...new Set(response.clients
      .filter(client => isAtc(client))
      .map((atc: any) => atc.uir))].filter(uir => !!uir);

    const firs = [...new Set(response.clients
      .filter(client => client.type === 'atc')
      .map((atc: any) => atc.fir))].filter(fir => !!fir);

    return this.http.get<Uir[]>(`${this.apiUrl}/firs`, { params: new HttpParams().set('icao', uirs.join(',')) }).pipe(
      defaultIfEmpty([]),
      map(uirsRes => uirsRes.reduce((acc, uir) => acc.concat(uir.firs), [])),
      map(firsToFetch => [ ...firs, ...firsToFetch ]),
      switchMap(firsToFetch => this.http.get<Fir[]>(`${this.apiUrl}/firs`,
        { params: new HttpParams().set('icao', firsToFetch.join(',')) }
      )),
      defaultIfEmpty([]),
      map(firsRes => ({ ...response, firs: firsRes })),
    );
  }

}
