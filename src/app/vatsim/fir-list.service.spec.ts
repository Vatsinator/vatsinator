import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FirListService } from './fir-list.service';
import { API_URL } from '../api-url';

describe('FirListService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_HOST' },
      ]
    });

    httpController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: FirListService = TestBed.get(FirListService);
    expect(service).toBeTruthy();
  });

  describe('#fir()', () => {
    it('should call api', inject([FirListService], (service: FirListService) => fakeAsync(() => {
      service.fir('FAKE_ICAO').subscribe();
      tick();
      httpController.expectOne('FAKE_HOST/fir/FAKE_ICAO');
      httpController.verify();
    })));
  });
});
