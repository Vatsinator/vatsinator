import { Injectable, Inject } from '@angular/core';
import { API_URL } from '../api-url';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from './models/client';
import { HttpClient } from '@angular/common/http';

interface VatsimData {
  connectedClients: number;
  clients: Client[];
}

@Injectable({
  providedIn: 'root'
})
export class VatsimService {

  private clientsSource = new BehaviorSubject<Client[]>([]);
  public readonly clients = this.clientsSource.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.http.get<VatsimData>(`${this.apiUrl}/vatsim/data`).subscribe(data => this.clientsSource.next(data.clients));
  }

}
