import { Component } from '@angular/core';
import { VatsimService } from '../vatsim.service';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-vatsim-status',
  templateUrl: './vatsim-status.component.html',
  styleUrls: ['./vatsim-status.component.scss']
})
export class VatsimStatusComponent {

  update: Observable<Date>;

  constructor(
    private vatsimService: VatsimService,
  ) {
    this.update = this.vatsimService.general.pipe(pluck('update'));
  }

}
