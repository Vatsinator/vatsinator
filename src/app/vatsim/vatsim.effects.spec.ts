import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { VatsimEffects } from './vatsim.effects';

describe('VatsimEffects', () => {
  let actions$: Observable<any>;
  let effects: VatsimEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VatsimEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(VatsimEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
