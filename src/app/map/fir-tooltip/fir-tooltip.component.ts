import { Component, Input } from '@angular/core';
import { Fir } from '@app/vatsim/models';

@Component({
  selector: 'app-fir-tooltip',
  templateUrl: './fir-tooltip.component.html',
  styleUrls: ['./fir-tooltip.component.scss']
})
export class FirTooltipComponent {

  @Input()
  fir: Fir;

}
