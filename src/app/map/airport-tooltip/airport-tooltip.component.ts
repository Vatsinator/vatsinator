import { Component, Input } from '@angular/core';
import { Airport } from '../models/airport';

@Component({
  selector: 'app-airport-tooltip',
  templateUrl: './airport-tooltip.component.html',
  styleUrls: ['./airport-tooltip.component.scss']
})
export class AirportTooltipComponent {

  @Input()
  airport: Airport;

}
