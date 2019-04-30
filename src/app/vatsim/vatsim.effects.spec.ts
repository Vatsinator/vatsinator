import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject, of } from 'rxjs';
import { VatsimEffects } from './vatsim.effects';
import { VatsimService } from './vatsim.service';
import { RefreshVatsimData, VatsimDataRefreshed } from './vatsim.actions';
import { VatsimData } from './models';

const mockVatsimData: VatsimData = {
  general: {
    version: 0,
    reload: 2,
    update: new Date(),
    atisAllowMin: 5,
    connectedClients: 128,
  },
  clients: [],
  activeAirports: [],
  firs: [],
  uirs: [],
};

class VatsimServiceStub {
  fetchVatsimData() { return of(mockVatsimData); }
}

describe('VatsimEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: VatsimEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VatsimEffects,
        provideMockActions(() => actions),
        { provide: VatsimService, useClass: VatsimServiceStub },
      ]
    });

    effects = TestBed.get(VatsimEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('refreshVatsimData', () => {
    beforeEach(() => {
      actions = new ReplaySubject<any>(1);
      actions.next(new RefreshVatsimData());
    });

    it('should trigger VatsimDataRefreshed', () => {
      effects.refreshVatsimData.subscribe(action => {
        expect(action).toEqual(new VatsimDataRefreshed(mockVatsimData));
      });
    });
  });
});
