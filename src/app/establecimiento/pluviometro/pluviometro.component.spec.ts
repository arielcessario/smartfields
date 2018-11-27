import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviometroComponent } from './pluviometro.component';

describe('PluviometroComponent', () => {
  let component: PluviometroComponent;
  let fixture: ComponentFixture<PluviometroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluviometroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviometroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
