import { Action } from '@ngrx/store';
import { VatsimData } from './models';

export enum VatsimActionTypes {
  RefreshVatsimData = '[Vatsim] Refresh Vatsim Data',
  VatsimDataRefreshed = '[Vatsim] Vatsim Data Refreshed',
}

export class RefreshVatsimData implements Action {
  readonly type = VatsimActionTypes.RefreshVatsimData;
}

export class VatsimDataRefreshed implements Action {
  readonly type = VatsimActionTypes.VatsimDataRefreshed;
  constructor(public payload: VatsimData) { }
}

export type VatsimActions = RefreshVatsimData;
