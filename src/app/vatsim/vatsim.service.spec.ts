import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VatsimService } from './vatsim.service';
import { API_URL } from '../api-url';

describe('VatsimService', () => {
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: API_URL, useValue: 'FAKE_HOST' },
      ],
    });

    httpController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: VatsimService = TestBed.get(VatsimService);
    expect(service).toBeTruthy();
  });

  it('should call api', inject([VatsimService], (service: VatsimService) => {
    httpController.expectOne('FAKE_HOST/vatsim/data');
    httpController.verify();
  }));

  describe('#refresh()', () => {
    it('should call api', inject([VatsimService], (service: VatsimService) => {
      httpController.expectOne('FAKE_HOST/vatsim/data');
      service.refresh();
      httpController.expectOne('FAKE_HOST/vatsim/data');
      httpController.verify();
    }));
  });
});
