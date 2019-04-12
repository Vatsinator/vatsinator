import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { ReplaySubject, zip, Observable } from 'rxjs';
import { VatsimData, Fir } from './models';
import { HttpClient } from '@angular/common/http';
import { switchMap, defaultIfEmpty, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  private dataSource = new ReplaySubject<VatsimData>(1);

  readonly data: Observable<VatsimData & { firs: Fir[] }> = this.dataSource.asObservable().pipe(
    switchMap(data => this.resolveFirs(data)),
    shareReplay(),
  );

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    setInterval(() => this.refresh(), 2 * 60 * 1000);
    this.refresh();
  }

  refresh() {
    this.http.get<VatsimData>(`${this.apiUrl}/vatsim/data`).subscribe(response => this.dataSource.next(response));
  }

  private resolveFirs(response: VatsimData) {
    const firs = [...new Set(response.clients
      .filter(client => client.type === 'atc')
      .map((atc: any) => atc.fir))].filter(fir => !!fir);

    return zip(...firs.map(icao => this.http.get<Fir>(`${this.apiUrl}/firs/${icao}`))).pipe(
      defaultIfEmpty([]),
      map(firsRes => ({ ...response, firs: firsRes }),
    ));
  }

}
