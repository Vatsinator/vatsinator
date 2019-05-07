import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
import { By } from '@angular/platform-browser';
import { Pilot } from '@app/vatsim/models';
import { Subject } from 'rxjs';
import { MapService } from '@app/map/map.service';

class MapServiceStub {
  map = new Subject<void>();
}

describe('SidebarComponent', () => {
  const initialState = {
    sidebar: {
      state: 'opened',
      selectedItem: null,
    },
    vatsim: {
      vatsimData: {
        clients: [],
        firs: [],
        activeAirports: [],
      }
    }
  };

  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        FlightDetailsComponent,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: MapService, useClass: MapServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reacts to sidebarSelectedFlight changes', () => {
    const store: MockStore<any> = TestBed.get(Store);

    const mockPilot: Pilot = { callsign: 'FAKE_CALLSIGN', cid: 1234, name: 'FAKE_NAME', type: 'pilot', position: [0, 0],
      onlineFrom: new Date(), aircraft: 'FAKE_AIRCRAFT', heading: 0, from: 'FAKE_AIRPORT_1', to: 'FAKE_AIRPORT_2', groundSpeed: 0,
      transponder: '', altitude: 0, route: '', remarks: '', flightPhase: 'departing',
    };

    store.setState({
      sidebar: { state: 'opened', selectedItem: { callsign: 'FAKE_CALLSIGN' } },
      vatsim: { vatsimData: { clients: [ mockPilot ], firs: [], activeAirports: [] } },
    });

    fixture.detectChanges();
    const flightDetailsComponent = fixture.debugElement.query(By.directive(FlightDetailsComponent))
      .componentInstance as FlightDetailsComponent;
    expect(flightDetailsComponent.pilot).toEqual(mockPilot);
  });

  describe('#close()', () => {
    it('should dispatch CloseSidebar', () => {
      const spy = spyOn(TestBed.get(Store), 'dispatch');
      component.close();
      expect(spy).toHaveBeenCalled();
    });
  });
});
