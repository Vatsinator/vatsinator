import { TestBed, inject } from '@angular/core/testing';
import { MarkerService } from './marker.service';
import { Pilot } from './models/pilot';
import { latLng } from 'leaflet';
import { Airport } from './models/airport';

describe('MarkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarkerService = TestBed.get(MarkerService);
    expect(service).toBeTruthy();
  });

  describe('#aircraft()', () => {
    it('should return marker at the given position and heading', inject([MarkerService], (service: MarkerService) => {
      const pilot = {
        position: { latitude: 32.149989, longitude: -110.835842 },
        aircraft: 'ZZZZ',
        heading: 101,
        callsign: 'FAKE_CALLSIGN',
      } as Pilot;

      const marker = service.aircraft(pilot);
      expect(marker.getLatLng()).toEqual(latLng(32.149989, -110.835842));
      expect(marker.options.rotationAngle).toEqual(101);
      expect(marker.getTooltip()).toBeTruthy();
    }));

    it('should fetch correct aircraft icon');
  });

  describe('#airport()', () => {
    it('should return marker at the given position', inject([MarkerService], (service: MarkerService) => {
      const airport = { lat: 27.686944, lon: 86.729722, icao: 'ZZZZ', atcs: [] } as Airport;
      const marker = service.airport(airport);
      expect(marker.getLatLng()).toEqual(latLng(27.686944, 86.729722));
      expect(marker.getTooltip()).toBeTruthy();
    }));

    it('should fetch correct icon');
  });
});
