import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadosComponent } from './ganados.component';

describe('GanadosComponent', () => {
  let component: GanadosComponent;
  let fixture: ComponentFixture<GanadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
