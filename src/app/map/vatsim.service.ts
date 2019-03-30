import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Client } from './models/client';
import { HttpClient } from '@angular/common/http';
import { Airport } from './models/airport';

interface VatsimData {
  connectedClients: number;
  clients: Client[];
  activeAirports: Airport[];
}

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  private clientsSource = new BehaviorSubject<Client[]>([]);
  readonly clients = this.clientsSource.asObservable();

  private airportsSource = new ReplaySubject<Airport[]>(1);
  readonly airports = this.airportsSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.http.get<VatsimData>(`${this.apiUrl}/vatsim/data`).subscribe(data => {
      this.clientsSource.next(data.clients);
      this.airportsSource.next(data.activeAirports);
    });
  }

}
