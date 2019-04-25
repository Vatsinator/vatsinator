import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Pilot } from '@app/vatsim/models';
import { MapService } from '@app/map/map.service';
import { Control, control } from 'leaflet';
import 'leaflet-sidebar-v2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  private sidebarControl: Control.Sidebar;

  selectedFlight: Observable<Pilot>;

  @ViewChild('sidebar', { read: ElementRef })
  set sidebar(sidebar: ElementRef) {
    this.sidebarControl = control.sidebar({ container: sidebar.nativeElement });
  }

  constructor(
    private mapService: MapService,
  ) {
    this.selectedFlight = this.mapService.selectedItem;

    this.mapService.selectedItem.subscribe(() => {
      this.sidebarControl.open('flight');
    });
  }

  ngOnInit() {
    this.mapService.map.subscribe(theMap => this.sidebarControl.addTo(theMap));
  }

}
