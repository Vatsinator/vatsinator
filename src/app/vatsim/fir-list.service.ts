import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api-url';
import { Observable } from 'rxjs';
import { Fir } from './models/fir';

@Injectable({
  providedIn: 'root'
})
export class FirListService {

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) { }

  fir(icao: string): Observable<Fir> {
    return this.http.get<Fir>(`${this.apiUrl}/firs/${icao}`);
  }

}
