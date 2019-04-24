import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vatsim-status',
  templateUrl: './vatsim-status.component.html',
  styleUrls: ['./vatsim-status.component.scss']
})
export class VatsimStatusComponent {

  @Input()
  updated: Date;

}
