import { TestBed } from '@angular/core/testing';

import { AircraftIconService } from './aircraft-icon.service';

describe('AircraftIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AircraftIconService = TestBed.get(AircraftIconService);
    expect(service).toBeTruthy();
  });
});
