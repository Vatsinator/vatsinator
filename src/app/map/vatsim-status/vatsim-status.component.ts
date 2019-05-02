import { Component, Input } from '@angular/core';
import { VatsimStatusNumbers } from '../models/vatsim-status-numbers';

@Component({
  selector: 'app-vatsim-status',
  templateUrl: './vatsim-status.component.html',
  styleUrls: ['./vatsim-status.component.scss']
})
export class VatsimStatusComponent {

  @Input()
  updated: Date;

  @Input()
  numbers: VatsimStatusNumbers;

}
