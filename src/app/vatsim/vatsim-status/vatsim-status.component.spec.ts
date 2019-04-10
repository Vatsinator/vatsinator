import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VatsimStatusComponent } from './vatsim-status.component';
import { of } from 'rxjs';
import { VatsimService } from '../vatsim.service';

class VatsimServiceStub {
  general = of({ update: new Date() });
}

describe('VatsimStatusComponent', () => {
  let component: VatsimStatusComponent;
  let fixture: ComponentFixture<VatsimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatsimStatusComponent ],
      providers: [
        { provide: VatsimService, useClass: VatsimServiceStub },
      ]
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
