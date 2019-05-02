import { Component, Input } from '@angular/core';
import { Pilot, Airport } from '@app/vatsim/models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { departure, destination } from '@app/vatsim/vatsim.selectors';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent {

  private mPilot: Pilot;

  departure: Observable<Airport>;
  destination: Observable<Airport>;

  @Input()
  set pilot(pilot: Pilot) {
    this.mPilot = pilot;
    this.departure = this.store.select(departure, { callsign: pilot.callsign });
    this.destination = this.store.select(destination, { callsign: pilot.callsign });
  }

  get pilot() {
    return this.mPilot;
  }

  constructor(
    private store: Store<any>,
  ) { }

}
