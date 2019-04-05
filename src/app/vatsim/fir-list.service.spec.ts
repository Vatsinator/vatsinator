import { TestBed } from '@angular/core/testing';

import { FirListService } from './fir-list.service';

describe('FirListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirListService = TestBed.get(FirListService);
    expect(service).toBeTruthy();
  });
});
