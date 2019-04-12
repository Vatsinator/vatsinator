import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef, EmbeddedViewRef, NgZone, Type } from '@angular/core';
import { Pilot, Airport, Fir, Client, isAtc, Atc } from '@app/vatsim/models';
import { FlightTooltipComponent } from './flight-tooltip/flight-tooltip.component';
import { AirportTooltipComponent } from './airport-tooltip/airport-tooltip.component';
import { FirTooltipComponent } from './fir-tooltip/fir-tooltip.component';
import { VatsimService } from '@app/vatsim/vatsim.service';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  private tooltipRef?: ComponentRef<any>;
  private clients: Client[];
  private airports: Airport[];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private zone: NgZone,
    private vatsimService: VatsimService,
  ) {
    // This is not perfect, but we need async data in sync context because leaflet doesn't
    // let us create tooltips in async way
    this.vatsimService.data.subscribe(data => {
      this.clients = data.clients;
      this.airports = data.activeAirports;
    });
  }

  forFlight(pilot: Pilot): HTMLElement {
    return this.create(FlightTooltipComponent, componentRef => {
      componentRef.instance.pilot = pilot;
      componentRef.instance.departure = this.airports.find(ap => ap.icao === pilot.from);
      componentRef.instance.destination = this.airports.find(ap => ap.icao === pilot.to);
    });
  }

  forAirport(airport: Airport): HTMLElement {
    return this.create(AirportTooltipComponent, componentRef => {
      componentRef.instance.airport = airport;
      componentRef.instance.atcs = this.clients.filter(c => isAtc(c) && c.airport === airport.icao) as Atc[];
    });
  }

  forFir(fir: Fir): HTMLElement {
    return this.create(FirTooltipComponent, componentRef => {
      componentRef.instance.fir = fir;
      componentRef.instance.atcs = this.clients.filter(c => isAtc(c) && c.fir === fir.icao) as Atc[];
    });
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
