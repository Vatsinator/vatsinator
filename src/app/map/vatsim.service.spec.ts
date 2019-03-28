import { TestBed } from '@angular/core/testing';

import { VatsimService } from './vatsim.service';

describe('VatsimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VatsimService = TestBed.get(VatsimService);
    expect(service).toBeTruthy();
  });
});
