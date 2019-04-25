import { Component, Input } from '@angular/core';
import { Pilot, Airport } from '@app/vatsim/models';
import { VatsimService } from '@app/vatsim/vatsim.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.departure = this.vatsimService.data.pipe(
      map(data => data.activeAirports.find(ap => ap.icao === pilot.from)),
    );
    this.destination = this.vatsimService.data.pipe(
      map(data => data.activeAirports.find(ap => ap.icao === pilot.to)),
    );
  }

  get pilot() {
    return this.mPilot;
  }

  constructor(
    private vatsimService: VatsimService,
  ) { }

}
