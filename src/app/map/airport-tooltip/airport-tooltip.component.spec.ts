import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportTooltipComponent } from './airport-tooltip.component';

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
});
