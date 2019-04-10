import { TestBed, inject } from '@angular/core/testing';
import { MarkerService } from './marker.service';
import { Pilot, Airport } from '@app/vatsim/models';
import { latLng } from 'leaflet';
import { TooltipService } from './tooltip.service';

class TooltipServiceStub {
  forFlight(pilot: Pilot) { }
}

describe('MarkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: TooltipService, useClass: TooltipServiceStub },
    ]
  }));

  it('should be created', () => {
    const service: MarkerService = TestBed.get(MarkerService);
    expect(service).toBeTruthy();
  });

  describe('#aircraft()', () => {
    it('should return marker at the given position and heading', inject([MarkerService], (service: MarkerService) => {
      const pilot = {
        position: [32.149989, -110.835842],
        aircraft: 'ZZZZ',
        heading: 101,
        callsign: 'FAKE_CALLSIGN',
      } as Pilot;

      const marker = service.aircraft(pilot);
      expect(marker.getLatLng()).toEqual(latLng(32.149989, -110.835842));
      expect(marker.options.rotationAngle).toEqual(101);
      expect(marker.getTooltip()).toBeTruthy();
    }));
  });

  describe('#airport()', () => {
    it('should return marker at the given position', inject([MarkerService], (service: MarkerService) => {
      const airport = { position: [27.686944, 86.729722], icao: 'ZZZZ', atcs: [] } as Airport;
      const marker = service.airport(airport);
      expect(marker.getLatLng()).toEqual(latLng(27.686944, 86.729722));
      expect(marker.getTooltip()).toBeTruthy();
    }));

    it('should fetch correct icon', inject([MarkerService], (service: MarkerService) => {
      const airport = { position: [27.686944, 86.729722], icao: 'ZZZZ', atcs: [] } as Airport;
      const marker = service.airport(airport);
      expect(marker.options.icon.options.iconUrl).toEqual('/assets/airport.png');

      const airport2 = { position: [27.686944, 86.729722], icao: 'ZZZZ', atcs: ['FAKE_ATC'] } as Airport;
      const marker2 = service.airport(airport2);
      expect(marker2.options.icon.options.iconUrl).toEqual('/assets/airport_atc.png');
    }));
  });
});
