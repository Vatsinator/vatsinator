import { Pipe, PipeTransform } from '@angular/core';
import { Airport } from '@app/vatsim/models';

@Pipe({
  name: 'airport'
})
export class AirportPipe implements PipeTransform {

  transform(value: Airport | string): string {
    if (typeof value === 'string') {
      return value;
    } else {
      return `${value.icao} ${value.city}`;
    }
  }

}
