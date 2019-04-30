import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { of, Observable } from 'rxjs';
import { VatsimData, Fir, isAtc, Uir, Atc } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map, tap } from 'rxjs/operators';

type VatsimDataResponse = Pick<VatsimData, Exclude<keyof VatsimData, 'firs'|'uirs'>>;

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fetchVatsimData(): Observable<VatsimData> {
    return this.http.get<VatsimDataResponse>(`${this.apiUrl}/vatsim/data`).pipe(
      switchMap(response => this.resolveFirs(response)),
    );
  }

  private fetchFirs(firIcaos: string[]) {
    return firIcaos.length === 0 ? of([]) :
      this.http.get<Fir[]>(`${this.apiUrl}/firs`, { params: new HttpParams().set('icao', firIcaos.join(',')) });
  }

  private resolveFirs(response: VatsimDataResponse) {
    const uirsToFetch = [...new Set(response.clients
      .filter(client => isAtc(client))
      .map((atc: Atc) => atc.uir))].filter(uir => !!uir);

    const firsToFetch = [...new Set(response.clients
      .filter(client => isAtc(client))
      .map((atc: Atc) => atc.fir))].filter(fir => !!fir);

    const fetchUirs = uirsToFetch.length === 0 ? of([]) :
      this.http.get<Uir[]>(`${this.apiUrl}/firs`, { params: new HttpParams().set('icao', uirsToFetch.join(',')) });

    let uirs: Uir[];

    return fetchUirs.pipe(
      tap(uirsRes => uirs = uirsRes.map(uir => (
        { ...uir,
            atcs: response.clients
              .filter(client => isAtc(client) && client.uir === uir.icao)
              .map(c => c.callsign)
        }
      ))),
      map(uirsRes => uirsRes.reduce((acc, uir) => acc.concat(uir.firs), [])),
      map(firsInUirs => [ ...new Set([ ...firsToFetch, ...firsInUirs ])]),
      switchMap(firs => this.fetchFirs(firs)),
      map(firs => firs.map(fir => {
        const firAtcs = response.clients
          .filter(client => isAtc(client) && client.fir === fir.icao)
          .map(c => c.callsign);
        return { ...fir,
          hasUirAtcsOnly: firAtcs.length === 0,
          atcs: [
            ...firAtcs,
            ...uirs
              .filter(uir => uir.firs.find(f => f === fir.icao))
              .map(u => u.atcs)
              .reduce((acc, x) => acc.concat(x), [])
          ]
        };
      })),
      map(firs => ({ ...response, firs, uirs })),
    );
  }

}
