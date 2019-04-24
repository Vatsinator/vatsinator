import { Component, ViewChild, ElementRef } from '@angular/core';
import 'leaflet-easybutton';
import { Map, MapOptions, tileLayer, LeafletEvent, easyButton, Control } from 'leaflet';
import { MapService } from '../map.service';
import { MapViewService } from '../map-view.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutDialogComponent } from '@app/shared/about-dialog/about-dialog.component';
import { VatsimService } from '@app/vatsim/vatsim.service';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { VatsimStatusComponent } from '../vatsim-status/vatsim-status.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        // tslint:disable-next-line:max-line-length
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }),
    ],
    zoom: this.mapViewService.zoom,
    center: this.mapViewService.center,
    preferCanvas: true,
  };

  updated: Observable<Date>;

  @ViewChild(VatsimStatusComponent, { read: ElementRef })
  vatsimStatus: ElementRef;

  constructor(
    private mapService: MapService,
    private mapViewService: MapViewService,
    private ngbModal: NgbModal,
    private vatsimService: VatsimService,
  ) {
    this.updated = this.vatsimService.data.pipe(
      pluck('general'),
      pluck('update'),
    );
  }

  onMapReady(theMap: Map) {
    this.mapService.addMap(theMap);
    easyButton('fa-info', () => this.openAboutDialog(), 'About').addTo(theMap);

    const statusControl = new Control({ position: 'bottomleft' });
    statusControl.onAdd = () => this.vatsimStatus.nativeElement;
    statusControl.addTo(theMap);
  }

  onMoveEnd(event: LeafletEvent) {
    const map = event.target as Map;
    this.mapViewService.center = map.getCenter();
    this.mapViewService.save();
  }

  onZoomEnd(event: LeafletEvent) {
    const map = event.target as Map;
    this.mapViewService.zoom = map.getZoom();
    this.mapViewService.save();
  }

  private openAboutDialog() {
    this.ngbModal.open(AboutDialogComponent, { size: 'sm', centered: true });
  }

}
