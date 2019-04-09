import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AirportTooltipComponent } from './airport-tooltip.component';
import { Airport } from '../models/airport';
import { By } from '@angular/platform-browser';

describe('AirportTooltipComponent', () => {
  let component: AirportTooltipComponent;
  let fixture: ComponentFixture<AirportTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ICAO code', () => {
    const airport = { icao: 'FAKE_ICAO' } as Airport;
    component.airport = airport;
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('.icao')).nativeElement as HTMLElement;
    expect(el.innerText).toEqual('FAKE_ICAO');
  });

  it('should show city if available');
  it('should list ATCs');
});
