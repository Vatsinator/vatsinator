import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { Map, latLng, LeafletEvent } from 'leaflet';
import { MapService } from '../map.service';
import { MapViewService } from '../map-view.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MapServiceStub {
  addMap(map: Map) { }
}

class MapViewServiceStub {
  center = latLng(0, 0);
  zoom = 3;
  save() { }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      providers: [
        { provide: MapService, useClass: MapServiceStub },
        { provide: MapViewService, useClass: MapViewServiceStub },
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
    // disabled until I figure out how to handle easyButton()
    xit('should call MapService.addMap()', () => {
      const map = {} as Map;
      const spy = spyOn(TestBed.get(MapService), 'addMap');
      component.onMapReady(map);
      expect(spy).toHaveBeenCalledWith(map);
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
