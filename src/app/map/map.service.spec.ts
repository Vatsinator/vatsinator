import { TestBed, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { MarkerService } from './marker.service';
import { VatsimService } from '@app/vatsim/vatsim.service';
import { Subject } from 'rxjs';
import { Airport, Client, Fir } from '@app/vatsim/models';
import { Map, Layer } from 'leaflet';

class VatsimServiceStub {
  airports = new Subject<Airport[]>();
  clients = new Subject<Client[]>();
  firs = new Subject<Fir[]>();
}

class MarkerServiceStub {

}

class MapStub {
  createPane(name: string) { return { style: {} }; }
  addLayer(layer: Layer) { }
}

describe('MapService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: VatsimService, useClass: VatsimServiceStub },
      { provide: MarkerService, useClass: MarkerServiceStub },
    ]
  }));

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));

  describe('#addMap()', () => {
    it('creates panes', inject([MapService], (service: MapService) => {
      const map = new MapStub() as Map;
      const spy = spyOn(map, 'createPane').and.callThrough();

      service.addMap(map);
      expect(spy).toHaveBeenCalledTimes(5);
    }));

    it('adds layers', inject([MapService], (service: MapService) => {
      const map = new MapStub() as Map;
      const spy = spyOn(map, 'addLayer').and.callThrough();

      service.addMap(map);
      expect(spy).toHaveBeenCalledTimes(5);
    }));
  });

  describe('#addFlight',  () => {
    it('should get proper marker');
    it('should handle mouse events');
    it('should add the marker to flights layer');
  });

  describe('#showFlightLines()', () => {
    it('should generate lines');
    it('should add lines to lines layer');
  });

  describe('#addAirport', () => {
    it('should get proper marke');
    it('should handle mouse events');
    it('should add the marker to airports layer');
  });

  describe('#showAirportLines()', () => {
    it('should generate lines');
    it('should add lines to lines layer');
  });

  describe('#clearLines()', () => {
    it('should clear lines layer');
  });
});
