import { Component, Input } from '@angular/core';
import { Pilot } from '../models/pilot';

@Component({
  selector: 'app-flight-tooltip',
  templateUrl: './flight-tooltip.component.html',
  styleUrls: ['./flight-tooltip.component.scss'],
})
export class FlightTooltipComponent {

  @Input()
  pilot: Pilot;

}
