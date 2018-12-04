import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoComponent } from './ganado.component';

describe('GanadoComponent', () => {
  let component: GanadoComponent;
  let fixture: ComponentFixture<GanadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
