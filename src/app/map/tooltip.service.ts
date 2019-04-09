import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, EmbeddedViewRef, NgZone } from '@angular/core';
import { Pilot } from './models/pilot';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';

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
      const el = (this.tooltipRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      return el;
    });
  }

}
