import { Selectable } from './models/selectable';
import { SidebarActions, SidebarActionTypes, SidebarSelectItem } from './sidebar.actions';

export interface State {
  state: 'opened' | 'closed';
  selectedItem: Selectable;
}

export const initialState: State = {
  state: 'closed',
  selectedItem: null,
};

export function reducer(state = initialState, action: SidebarActions): State {
  switch (action.type) {
    case SidebarActionTypes.OpenSidebar:
      return { ...state, state: 'opened' };

    case SidebarActionTypes.CloseSidebar:
      return { ...state, state: 'closed' };

    case SidebarActionTypes.SelectItem:
      return { ...state, selectedItem: (action as SidebarSelectItem).payload.item };

    default:
      return state;
  }
}
