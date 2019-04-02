import { TestBed } from '@angular/core/testing';

import { MapViewService } from './map-view.service';

describe('MapViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapViewService = TestBed.get(MapViewService);
    expect(service).toBeTruthy();
  });
});
