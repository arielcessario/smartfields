import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RodeosComponent } from './rodeos.component';

describe('RodeosComponent', () => {
  let component: RodeosComponent;
  let fixture: ComponentFixture<RodeosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RodeosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RodeosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
