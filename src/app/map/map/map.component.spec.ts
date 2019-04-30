import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { Map, latLng, LeafletEvent, map } from 'leaflet';
import { MapService } from '../map.service';
import { MapViewService } from '../map-view.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { VatsimService } from '@app/vatsim/vatsim.service';
import * as L from 'leaflet';
import { VatsimStatusComponent } from '../vatsim-status/vatsim-status.component';

class MapServiceStub {
  addMap(theMap: Map) { }
}

class MapViewServiceStub {
  center = latLng(0, 0);
  zoom = 3;
  save() { }
}

class VatsimServiceStub {
  data = EMPTY;
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        VatsimStatusComponent,
      ],
      providers: [
        { provide: MapService, useClass: MapServiceStub },
        { provide: MapViewService, useClass: MapViewServiceStub },
        { provide: VatsimService, useClass: VatsimServiceStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefer canvas', () => {
    expect(component.options.preferCanvas).toEqual(true);
  });

  it('should set proper map view', () => {
    expect(component.options.center).toEqual(latLng(0, 0));
    expect(component.options.zoom).toEqual(3);
  });

  describe('#onMapReady()', () => {
    it('should call MapService.addMap()', () => {
      const theMap = map(document.createElement('div'));
      spyOn(L, 'easyButton').and.returnValue({ addTo: _ => ({}) } as L.Control.EasyButton);
      const addMap = spyOn(TestBed.get(MapService), 'addMap');
      component.onMapReady(theMap);
      expect(addMap).toHaveBeenCalledWith(theMap);
    });
  });

  describe('#onMoveEnd()', () => {
    it('should call MapViewService.save()', () => {
      const event = { target: { getCenter: () => {} } } as LeafletEvent;
      const spy = spyOn(TestBed.get(MapViewService), 'save');
      component.onMoveEnd(event);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#onZoomEnd()', () => {
    it('should call MapViewService.save()', () => {
      const event = { target: { getZoom: () => {} } } as LeafletEvent;
      const spy = spyOn(TestBed.get(MapViewService), 'save');
      component.onZoomEnd(event);
      expect(spy).toHaveBeenCalled();
    });
  });
});
