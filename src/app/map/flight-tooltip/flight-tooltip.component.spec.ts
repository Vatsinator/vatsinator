import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightTooltipComponent } from './flight-tooltip.component';
import { Pipe, PipeTransform } from '@angular/core';
import { Pilot } from '../models/pilot';
import { By } from '@angular/platform-browser';

@Pipe({ name: 'airport' })
class AirportPipeStub implements PipeTransform {
  transform(value: any) { return value; }
}

describe('FlightTooltipComponent', () => {
  let component: FlightTooltipComponent;
  let fixture: ComponentFixture<FlightTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FlightTooltipComponent,
        AirportPipeStub,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render callsign', () => {
    const pilot = { callsign: 'FAKE_CALLSIGN' } as Pilot;
    component.pilot = pilot;
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.callsign')).nativeElement as HTMLElement;
    expect(el.innerText).toEqual('FAKE_CALLSIGN');
  });
});
