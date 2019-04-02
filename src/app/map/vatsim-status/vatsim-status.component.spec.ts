import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatsimStatusComponent } from './vatsim-status.component';

describe('VatsimStatusComponent', () => {
  let component: VatsimStatusComponent;
  let fixture: ComponentFixture<VatsimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatsimStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatsimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
