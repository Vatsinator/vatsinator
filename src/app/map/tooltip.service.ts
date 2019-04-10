import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, EmbeddedViewRef, NgZone, Type } from '@angular/core';
import { Pilot } from './models/pilot';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { Airport } from './models/airport';
import { AirportTooltipComponent } from './airport-tooltip/airport-tooltip.component';
import { Fir } from '@app/vatsim/models/fir';
import { FirTooltipComponent } from './fir-tooltip/fir-tooltip.component';

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
    return this.create(FlightTooltipComponent, componentRef => componentRef.instance.pilot = pilot);
  }

  forAirport(airport: Airport): HTMLElement {
    return this.create(AirportTooltipComponent, componentRef => componentRef.instance.airport = airport);
  }

  forFir(fir: Fir): HTMLElement {
    return this.create(FirTooltipComponent, componentRef => componentRef.instance.fir = fir);
  }

  private create<T>(type: Type<T>, onCreated?: (componentRef: ComponentRef<T>) => void): HTMLElement {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
    }

    return this.zone.run(() => {
      const factory = this.componentFactoryResolver.resolveComponentFactory(type);
      const component = factory.create(this.injector);
      this.appRef.attachView(component.hostView);

      if (onCreated) {
        onCreated(component);
      }

      this.tooltipRef = component;
      return (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    });
  }

}
