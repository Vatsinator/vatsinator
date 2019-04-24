import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VatsimStatusComponent } from './vatsim-status.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('VatsimStatusComponent', () => {
  let component: VatsimStatusComponent;
  let fixture: ComponentFixture<VatsimStatusComponent>;

  const initialState = {
    vatsim: {
      vatsimData: {
        general: {
          update: new Date(),
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatsimStatusComponent ],
      providers: [
        provideMockStore({ initialState }),
      ],
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
