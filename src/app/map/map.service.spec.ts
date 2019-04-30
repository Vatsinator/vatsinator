import { TestBed, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { MarkerService } from './marker.service';
import { Airport, Fir, Pilot } from '@app/vatsim/models';
import { Map, Layer, marker, latLng } from 'leaflet';
import { provideMockStore } from '@ngrx/store/testing';

class MarkerServiceStub {
  marker = marker(latLng(0, 0));
  aircraft(pilot: Pilot) { return this.marker; }
  airport(airport: Airport) { return this.marker; }
  fir(fir: Fir) { return this.marker; }
}

class MapStub {
  createPane(name: string) { return { style: {} }; }
  addLayer(layer: Layer) { }
}

describe('MapService', () => {
  const initialState = {
    vatsim: {
      vatsimData: {
        clients: [],
        activeAirports: [],
        firs: [],
        uirs: [],
      },
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: MarkerService, useClass: MarkerServiceStub },
      provideMockStore({ initialState }),
    ],
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
    it('should get proper marker', inject([MapService], (service: MapService) => {
      const spy = spyOn(TestBed.get(MarkerService), 'aircraft').and.callThrough();
      service.addFlight({ } as Pilot);
      expect(spy).toHaveBeenCalled();
    }));

    it('should add the marker to flights layer', inject([MapService], (service: MapService) => {
      const spy = spyOn(TestBed.get(MarkerService).marker, 'addTo');
      service.addFlight({ } as Pilot);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('#showFlightLines()', () => {
    it('should generate lines');
    it('should add lines to lines layer');
  });

  describe('#addAirport', () => {
    it('should get proper marker', inject([MapService], (service: MapService) => {
      const spy = spyOn(TestBed.get(MarkerService), 'airport').and.callThrough();
      service.addAirport({ atcs: [] } as Airport);
      expect(spy).toHaveBeenCalled();
    }));

    it('should add the marker to airports layer', inject([MapService], (service: MapService) => {
      const spy = spyOn(TestBed.get(MarkerService).marker, 'addTo');
      service.addAirport({ atcs: [] } as Airport);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('#showAirportLines()', () => {
    it('should generate lines');
    it('should add lines to lines layer');
  });

  describe('#addFir()', () => {
    it('should add marker', inject([MapService], (service: MapService) => {
      const spy = spyOn(TestBed.get(MarkerService), 'fir').and.callThrough();
      service.addFir({ boundaries: [] } as Fir);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('#clearLines()', () => {
    it('should clear lines layer');
  });
});
