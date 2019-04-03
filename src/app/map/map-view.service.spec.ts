import { TestBed, inject } from '@angular/core/testing';
import { MapViewService } from './map-view.service';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { latLng } from 'leaflet';

class StorageServiceStub {
  get(key: string) { return null; }
  set(key: string, value: any) { }
}

describe('MapViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: LOCAL_STORAGE, useClass: StorageServiceStub },
    ]
  }));

  it('should be created', inject([MapViewService], (service: MapViewService) => {
    expect(service).toBeTruthy();
  }));

  it('should reset map view', inject([MapViewService], (service: MapViewService) => {
    expect(service.center).toEqual(latLng(0, 0));
    expect(service.zoom).toEqual(3);
  }));

  describe('#save()', () => {
    it('should call storage.set()', inject([MapViewService], (service: MapViewService) => {
      const spy = spyOn(TestBed.get(LOCAL_STORAGE), 'set');

      service.center = latLng(1.2, 3.4);
      service.zoom = 10;
      service.save();

      expect(spy).toHaveBeenCalledWith('map-view', { lat: 1.2, lng: 3.4, zoom: 10 });
    }));
  });
});
