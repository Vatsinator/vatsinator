import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { VatsimData } from '../models';
import { getVatsimData } from '../vatsim.selectors';

@Component({
  selector: 'app-vatsim-status',
  templateUrl: './vatsim-status.component.html',
  styleUrls: ['./vatsim-status.component.scss']
})
export class VatsimStatusComponent {

  update: Observable<Date>;

  constructor(
    private store: Store<{ vatsimData: VatsimData }>,
  ) {
    this.update = this.store.pipe(
      select(getVatsimData),
      pluck('general'),
      pluck('update'),
    );
  }

}
