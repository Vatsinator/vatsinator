import { Injectable } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MapService } from '@app/map/map.service';
import { control } from 'leaflet';
import 'leaflet-sidebar-v2';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(
    private mapService: MapService,
  ) { }

  registerSidebar(sidebar: SidebarComponent) {
    this.mapService.map.subscribe(map => control.sidebar({ container: sidebar.sidebar.nativeElement }).addTo(map));
  }

}
