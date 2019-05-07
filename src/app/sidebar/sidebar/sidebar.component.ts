import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Pilot } from '@app/vatsim/models';
import 'leaflet-sidebar';
import { control } from 'leaflet';
import { Store, select } from '@ngrx/store';
import { sidebarState, sidebarSelectedFlight } from '../sidebar.selectors';
import { MapService } from '@app/map/map.service';
import { CloseSidebar } from '../sidebar.actions';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '@app/app-state';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {

  private sidebarControl = new Subject<any>();
  private destroyed = new Subject<void>();

  selectedFlight: Observable<Pilot>;

  @ViewChild('sidebar', { read: ElementRef })
  set sidebar(sidebar: ElementRef) {
    const sidebarControl = (control as any).sidebar(sidebar.nativeElement, {
      position: 'left',
      closeButton: true,
      autoPan: false,
    });

    this.sidebarControl.next(sidebarControl);
  }

  constructor(
    private store: Store<AppState>,
    private mapService: MapService,
  ) {
    this.selectedFlight = this.store.pipe(select(sidebarSelectedFlight));

    combineLatest(
      this.mapService.map,
      this.sidebarControl,
    ).pipe(
      takeUntil(this.destroyed),
    ).subscribe(([theMap, sidebarControl]) => sidebarControl.addTo(theMap));

    combineLatest(
      this.store.select(sidebarState),
      this.sidebarControl,
    ).pipe(
      takeUntil(this.destroyed),
    ).subscribe(([state, sidebarControl]) => {
      switch (state) {
        case 'opened':
          sidebarControl.show();
          break;

        case 'closed':
          sidebarControl.hide();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  close() {
    this.store.dispatch(new CloseSidebar());
  }

}
