import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirTooltipComponent } from './fir-tooltip.component';

describe('FirTooltipComponent', () => {
  let component: FirTooltipComponent;
  let fixture: ComponentFixture<FirTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
