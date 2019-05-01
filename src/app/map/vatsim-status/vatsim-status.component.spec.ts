import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VatsimStatusComponent } from './vatsim-status.component';
import { By } from '@angular/platform-browser';

describe('VatsimStatusComponent', () => {
  let component: VatsimStatusComponent;
  let fixture: ComponentFixture<VatsimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatsimStatusComponent ],
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

  it('should format updated date', () => {
    component.updated = new Date(2019, 4, 1, 23, 48, 0, 0);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('span')).nativeElement as HTMLSpanElement;
    expect(el.innerText).toEqual('Updated: May 1, 2019, 23:48 UTC');
  });

  it('should format VATSIM numbers', () => {
    component.numbers = { clients: 42, pilots: 30, atcs: 12 };
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('span')).nativeElement as HTMLSpanElement;
    expect(el.innerText).toEqual('42 connected clients (30 pilots, 12 ATCs)');
  });
});
