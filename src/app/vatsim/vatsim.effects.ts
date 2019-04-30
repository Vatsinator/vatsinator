import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { VatsimService } from './vatsim.service';
import { VatsimActionTypes, VatsimDataRefreshed } from './vatsim.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class VatsimEffects {

  @Effect()
  refreshVatsimData = this.actions.pipe(
    ofType(VatsimActionTypes.RefreshVatsimData),
    mergeMap(() => this.vatsimService.fetchVatsimData().pipe(
      map(data => new VatsimDataRefreshed(data)),
      catchError(() => EMPTY),
    ))
  );

  constructor(
    private actions: Actions,
    private vatsimService: VatsimService,
  ) { }

}
