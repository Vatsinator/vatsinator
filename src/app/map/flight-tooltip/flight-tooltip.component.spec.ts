import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTooltipComponent } from './flight-tooltip.component';

describe('FlightTooltipComponent', () => {
  let component: FlightTooltipComponent;
  let fixture: ComponentFixture<FlightTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTooltipComponent ]
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
});
