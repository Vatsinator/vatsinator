import { Injectable, Inject } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';

const STORAGE_KEY = 'map-view';

@Injectable({
  providedIn: 'root'
})
export class MapViewService {

  center: LatLng;
  zoom: number;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) {
    const mapView = this.storage.get(STORAGE_KEY) || { lat: 0, lng: 0, zoom: 3 };
    this.center = latLng(mapView.lat, mapView.lng);
    this.zoom = mapView.zoom;
  }

  save() {
    this.storage.set(STORAGE_KEY, { ...this.center, zoom: this.zoom });
  }

}
