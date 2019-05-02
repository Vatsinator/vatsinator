import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VatsimData, isPilot, Pilot } from './models';
import { State } from './reducers';

export const vatsim = createFeatureSelector('vatsim');

export const vatsimData = createSelector(
  vatsim,
  (vatsimState: State) => vatsimState.vatsimData,
);

export const pilots = createSelector(
  vatsimData,
  (vatsimDataState: VatsimData) => vatsimDataState.clients.filter(c => isPilot(c)) as Pilot[],
);

export const airport = createSelector(
  vatsimData,
  (vatsimDataState: VatsimData, props: { icao: string }) => vatsimDataState.activeAirports.find(ap => ap.icao === props.icao),
);

export const departure = createSelector(
  vatsimData,
  (vatsimDataState: VatsimData, props: { callsign: string }) => {
    const pilot = vatsimDataState.clients.find(p => p.callsign === props.callsign);
    if (isPilot(pilot)) {
      return vatsimDataState.activeAirports.find(ap => ap.icao === pilot.from);
    }
  }
);

export const destination = createSelector(
  vatsimData,
  (vatsimDataState: VatsimData, props: { callsign: string }) => {
    const pilot = vatsimDataState.clients.find(p => p.callsign === props.callsign);
    if (isPilot(pilot)) {
      return vatsimDataState.activeAirports.find(ap => ap.icao === pilot.to);
    }
  }
);
