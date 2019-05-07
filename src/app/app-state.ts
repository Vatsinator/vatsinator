import { State as VatsimState } from './vatsim/reducers';
import { State as SidebarState } from './sidebar/sidebar.reducer';

export interface AppState {
  vatsim: VatsimState;
  sidebar: SidebarState;
}
