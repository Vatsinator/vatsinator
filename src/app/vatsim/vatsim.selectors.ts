import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VatsimData, isPilot, Pilot } from './models';
import { State } from './reducers';

export const getVatsim = createFeatureSelector('vatsim');

export const getVatsimData = createSelector(
  getVatsim,
  (vatsim: State) => vatsim.vatsimData,
);

export const getPilots = createSelector(
  getVatsimData,
  (vatsimData: VatsimData) => vatsimData.clients.filter(c => isPilot(c)) as Pilot[],
);

export const getAirport = createSelector(
  getVatsimData,
  (vatsimData: VatsimData, props: { icao: string }) => vatsimData.activeAirports.find(ap => ap.icao === props.icao),
);
