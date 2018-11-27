import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PotreroComponent } from './potrero.component';

describe('PotreroComponent', () => {
  let component: PotreroComponent;
  let fixture: ComponentFixture<PotreroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PotreroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PotreroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
