import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RodeoComponent } from './rodeo.component';

describe('RodeoComponent', () => {
  let component: RodeoComponent;
  let fixture: ComponentFixture<RodeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RodeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RodeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
