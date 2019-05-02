import { Action } from '@ngrx/store';
import { Selectable } from './models/selectable';

export enum SidebarActionTypes {
  Open = '[Sidebar] Open',
  Close = '[Sidebar] Close',
  SelectItem = '[Sidebar] Select item',
}

export class SidebarOpen implements Action {
  readonly type = SidebarActionTypes.Open;
}

export class SidebarClose implements Action {
  readonly type = SidebarActionTypes.Close;
}

export class SidebarSelectItem implements Action {
  readonly type = SidebarActionTypes.SelectItem;
  constructor(public payload: { item: Selectable }) { }
}

export type SidebarActions = SidebarOpen | SidebarClose | SidebarSelectItem;
