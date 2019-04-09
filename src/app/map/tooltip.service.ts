import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, EmbeddedViewRef, NgZone } from '@angular/core';
import { Pilot } from './models/pilot';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { Airport } from './models/airport';
import { AirportTooltipComponent } from './airport-tooltip/airport-tooltip.component';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  private tooltipRef?: ComponentRef<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private zone: NgZone,
  ) { }

  forFlight(pilot: Pilot): HTMLElement {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
    }

    return this.zone.run(() => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(FlightTooltipComponent);
      this.tooltipRef = factory.create(this.injector);
      this.appRef.attachView(this.tooltipRef.hostView);
      this.tooltipRef.instance.pilot = pilot;
      return (this.tooltipRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    });
  }

  forAirport(airport: Airport): HTMLElement {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
    }

    return this.zone.run(() => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(AirportTooltipComponent);
      this.tooltipRef = factory.create(this.injector);
      this.appRef.attachView(this.tooltipRef.hostView);
      this.tooltipRef.instance.airport = airport;
      return (this.tooltipRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    });
  }

}
