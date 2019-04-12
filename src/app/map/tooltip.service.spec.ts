import { TestBed, inject, async } from '@angular/core/testing';
import { TooltipService } from './tooltip.service';
import { Pilot, Airport, Fir } from '@app/vatsim/models';
import { NgModule, Pipe, PipeTransform, ApplicationRef } from '@angular/core';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { CommonModule } from '@angular/common';
import { AirportTooltipComponent } from './airport-tooltip/airport-tooltip.component';
import { FirTooltipComponent } from './fir-tooltip/fir-tooltip.component';
import { BehaviorSubject } from 'rxjs';
import { VatsimService } from '@app/vatsim/vatsim.service';

@Pipe({ name: 'airport' })
class AirportPipeStub implements PipeTransform {
  transform(value: any) { return value; }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AirportPipeStub,
    FlightTooltipComponent,
    AirportTooltipComponent,
    FirTooltipComponent,
  ],
  entryComponents: [
    FlightTooltipComponent,
    AirportTooltipComponent,
    FirTooltipComponent,
  ],
})
class TestModule { }

class VatsimServiceStub {
  data = new BehaviorSubject<any>({
    activeAirports: [],
    clients: [],
  });
}

describe('TooltipService', () => {
  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [ TestModule ],
    providers: [
      { provide: VatsimService, useClass: VatsimServiceStub },
    ],
  }).compileComponents()));

  it('should be created', () => {
    const service: TooltipService = TestBed.get(TooltipService);
    expect(service).toBeTruthy();
  });

  describe('#forFlight()', () => {
    it('returns a valid HTMLElement', inject([TooltipService], (service: TooltipService) => {
      expect(service.forFlight({} as Pilot).tagName).toEqual('APP-FLIGHT-TOOLTIP');
    }));

    it('attaches tooltip', inject([TooltipService], (service: TooltipService) => {
      const appRef = TestBed.get(ApplicationRef);
      const spy = spyOn(appRef, 'attachView');
      service.forFlight({} as Pilot);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('#forAirport()', () => {
    it('returns a valid HTMLElement', inject([TooltipService], (service: TooltipService) => {
      expect(service.forAirport({} as Airport).tagName).toEqual('APP-AIRPORT-TOOLTIP');
    }));

    it('attaches tooltip', inject([TooltipService], (service: TooltipService) => {
      const appRef = TestBed.get(ApplicationRef);
      const spy = spyOn(appRef, 'attachView');
      service.forAirport({} as Airport);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('#forFir()', () => {
    it('returns a valid HTMLElement', inject([TooltipService], (service: TooltipService) => {
      expect(service.forFir({} as Fir).tagName).toEqual('APP-FIR-TOOLTIP');
    }));

    it('attaches tooltip', inject([TooltipService], (service: TooltipService) => {
      const appRef = TestBed.get(ApplicationRef);
      const spy = spyOn(appRef, 'attachView');
      service.forFir({} as Fir);
      expect(spy).toHaveBeenCalled();
    }));
  });
});
