import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './sidebar.reducer';
import { pilots } from '@app/vatsim/vatsim.selectors';
import { SelectableFlight } from './models/selectable';

export const sidebar = createFeatureSelector('sidebar');

export const sidebarState = createSelector(
  sidebar,
  (state: State) => state.state,
);

export const sidebarSelectedItem = createSelector(
  sidebar,
  (state: State) => state.selectedItem,
);

export const sidebarSelectedFlight = createSelector(
  pilots,
  sidebarSelectedItem,
  (pilotsState, selectedItem) => selectedItem && pilotsState.find(p => p.callsign === (selectedItem as SelectableFlight).callsign),
);
