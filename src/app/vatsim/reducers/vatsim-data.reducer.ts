import { Action } from '@ngrx/store';
import { VatsimActionTypes, VatsimDataRefreshed } from '../vatsim.actions';
import { VatsimData } from '../models';

export type State = VatsimData;

export const initialState: State = {
  general: {
    version: 0,
    reload: 0,
    update: new Date(0),
    atisAllowMin: 0,
    connectedClients: 0,
  },
  clients: [],
  activeAirports: [],
  firs: [],
  uirs: [],
};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case VatsimActionTypes.VatsimDataRefreshed:
      return (action as VatsimDataRefreshed).payload;

    default:
      return state;
  }
}
