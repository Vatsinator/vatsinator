import { TestBed, inject, fakeAsync, tick, flush, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VatsimService } from './vatsim.service';
import { API_URL } from '../api-url';
import { Fir, Uir } from './models';

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

  it('should call the api', inject([VatsimService], (service: VatsimService) => {
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

    describe('processes data', () => {
      afterEach(() => {
        httpController.verify();
      });

      it('when there\'s no FIR', inject([VatsimService], (service: VatsimService) => {
        service.data.subscribe(data => {
          expect(data).toBeTruthy();
          expect(data.clients).toBeTruthy();
          expect(data.clients.length).toEqual(0);
        });

        const request = httpController.expectOne('FAKE_HOST/vatsim/data');
        expect(request.request.method).toBe('GET');

        httpController.expectNone('FAKE_HOST/firs');
        request.flush({ clients: [] });
      }));

      it('when there are FIRs but no UIRs', inject([VatsimService], (service: VatsimService) => {
        service.data.subscribe(data => {
          expect(data).toBeTruthy();
          expect(data.clients).toBeTruthy();
          expect(data.clients.length).toEqual(1);

          expect(data.firs).toBeDefined();
          expect(data.firs.length).toEqual(1);
          expect(data.firs[0].hasUirAtcsOnly).toBe(false);
          expect(data.firs[0].atcs).toEqual(['FAKE_CALLSIGN']);
        });

        httpController.expectOne('FAKE_HOST/vatsim/data').flush({ clients: [{ callsign: 'FAKE_CALLSIGN', type: 'atc', fir: 'FAKE_FIR' }] });
        httpController.expectOne('FAKE_HOST/firs?icao=FAKE_FIR').flush([{ icao: 'FAKE_FIR' }]);
      }));

      it('when there are only UIRs', inject([VatsimService], (service: VatsimService) => {
        service.data.subscribe(data => {
          expect(data).toBeTruthy();
          expect(data.clients).toBeTruthy();
          expect(data.clients.length).toEqual(1);

          expect(data.firs).toBeDefined();
          expect(data.firs.length).toEqual(3);
          for (const f of data.firs) {
            expect(f.hasUirAtcsOnly).toBe(true);
            expect(f.atcs).toEqual(['FAKE_CALLSIGN']);
          }
          expect(data.uirs.length).toEqual(1);
          expect(data.uirs[0].atcs).toEqual(['FAKE_CALLSIGN']);
        });

        httpController.expectOne('FAKE_HOST/vatsim/data').flush({ clients: [{ callsign: 'FAKE_CALLSIGN', type: 'atc', uir: 'FAKE_UIR' }] });
        httpController.expectOne('FAKE_HOST/firs?icao=FAKE_UIR').flush([{ icao: 'FAKE_UIR',
          firs: ['FAKE_FIR_1', 'FAKE_FIR_2', 'FAKE_FIR_3'] }]);
        httpController.expectOne('FAKE_HOST/firs?icao=FAKE_FIR_1,FAKE_FIR_2,FAKE_FIR_3').flush([{ icao: 'FAKE_FIR_1' },
          { icao: 'FAKE_FIR_2' }, { icao: 'FAKE_FIR_3' }]);
      }));

      it('when there are FIRs and UIRs', inject([VatsimService], (service: VatsimService) => {
        service.data.subscribe(data => {
          expect(data).toBeTruthy();
          expect(data.clients).toBeTruthy();
          expect(data.clients.length).toEqual(2);

          expect(data.firs).toBeDefined();
          expect(data.uirs).toBeDefined();

          expect(data.firs).toEqual([
            { icao: 'FAKE_FIR', hasUirAtcsOnly: false, atcs: ['FAKE_ATC_1', 'FAKE_ATC_2'] },
          ] as Fir[]);
          expect(data.uirs).toEqual([
            { icao: 'FAKE_UIR', firs: ['FAKE_FIR'], atcs: ['FAKE_ATC_2'] },
          ] as Uir[]);
        });

        httpController.expectOne('FAKE_HOST/vatsim/data').flush({ clients: [
          { callsign: 'FAKE_ATC_1', type: 'atc', fir: 'FAKE_FIR' },
          { callsign: 'FAKE_ATC_2', type: 'atc', uir: 'FAKE_UIR' },
        ]});
        httpController.expectOne('FAKE_HOST/firs?icao=FAKE_UIR').flush([{ icao: 'FAKE_UIR', firs: ['FAKE_FIR'] }]);
        httpController.expectOne('FAKE_HOST/firs?icao=FAKE_FIR').flush([{ icao: 'FAKE_FIR' }]);
      }));
    });
  });
});
