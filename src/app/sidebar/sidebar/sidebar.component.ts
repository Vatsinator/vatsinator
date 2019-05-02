import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Pilot } from '@app/vatsim/models';
import { Control, control } from 'leaflet';
import 'leaflet-sidebar-v2';
import { Store, select } from '@ngrx/store';
import { sidebarState, sidebarSelectedFlight } from '../sidebar.selectors';
import { MapService } from '@app/map/map.service';

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
    private store: Store<any>,
    private mapService: MapService,
  ) {
    this.store.pipe(
      select(sidebarState),
    ).subscribe(state => {
      switch (this.sidebarControl && state) {
        case 'opened':
          this.sidebarControl.open('flight');
          break;

        case 'closed':
          this.sidebarControl.close();
          break;
      }
    });

    this.selectedFlight = this.store.pipe(select(sidebarSelectedFlight));
  }

  ngOnInit() {
    this.mapService.map.subscribe(theMap => this.sidebarControl.addTo(theMap));
  }

}
