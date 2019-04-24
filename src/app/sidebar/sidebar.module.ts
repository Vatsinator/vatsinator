import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MapModule } from '@app/map/map.module';

@NgModule({
  declarations: [
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    MapModule,
  ],
  exports: [
    SidebarComponent,
  ]
})
export class SidebarModule { }
