import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { MapModule } from './map/map.module';
import { API_URL } from './api-url';
import { environment } from '@environment';
import { VatsimModule } from './vatsim/vatsim.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    NgbModalModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),

    MapModule,
    SidebarModule,
    VatsimModule,
  ],
  providers: [
    { provide: API_URL, useValue: environment.apiUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
