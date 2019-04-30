import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromVatsimData from './vatsim-data.reducer';
import { VatsimData, isPilot, Pilot } from '../models';

export interface State {
  vatsimData: fromVatsimData.State;
}

export const reducers: ActionReducerMap<State> = {
  vatsimData: fromVatsimData.reducer,
};
