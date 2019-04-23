import { Component } from '@angular/core';
import 'leaflet-easybutton';
import { Map, MapOptions, tileLayer, LeafletEvent, easyButton, Control, DomUtil } from 'leaflet';
import { MapService } from '../map.service';
import { MapViewService } from '../map-view.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AboutDialogComponent } from '@app/shared/about-dialog/about-dialog.component';

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

  constructor(
    private mapService: MapService,
    private mapViewService: MapViewService,
    private ngbModal: NgbModal,
  ) { }

  onMapReady(theMap: Map) {
    this.mapService.addMap(theMap);
    easyButton('fa-info', () => this.openAboutDialog(), 'About').addTo(theMap);

    const statusControl = Control.extend({
      options: {
        position: 'bottomleft',
      },

      onAdd(map) {
        const container = DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '.25rem 1rem';
        container.innerHTML = 'status';
        return container;
      },
    });

    theMap.addControl(new statusControl());
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
