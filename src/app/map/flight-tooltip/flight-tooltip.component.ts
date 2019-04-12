import { Component, Input } from '@angular/core';
import { Pilot, Airport } from '@app/vatsim/models';

@Component({
  selector: 'app-flight-tooltip',
  templateUrl: './flight-tooltip.component.html',
  styleUrls: ['./flight-tooltip.component.scss'],
})
export class FlightTooltipComponent {

  @Input()
  pilot: Pilot;

  @Input()
  departure: Airport;

  @Input()
  destination: Airport;

}
