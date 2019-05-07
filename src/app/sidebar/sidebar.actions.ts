import { Action } from '@ngrx/store';
import { Selectable } from './models/selectable';

export enum SidebarActionTypes {
  OpenSidebar = '[Sidebar] Open sidebar',
  CloseSidebar = '[Sidebar] Close sidebar',
  SelectItem = '[Sidebar] Select item',
}

export class OpenSidebar implements Action {
  readonly type = SidebarActionTypes.OpenSidebar;
}

export class CloseSidebar implements Action {
  readonly type = SidebarActionTypes.CloseSidebar;
}

export class SidebarSelectItem implements Action {
  readonly type = SidebarActionTypes.SelectItem;
  constructor(public payload: { item: Selectable }) { }
}

export type SidebarActions = OpenSidebar | CloseSidebar | SidebarSelectItem;
