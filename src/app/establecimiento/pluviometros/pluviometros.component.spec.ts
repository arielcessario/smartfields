import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluviometrosComponent } from './pluviometros.component';

describe('PluviometrosComponent', () => {
  let component: PluviometrosComponent;
  let fixture: ComponentFixture<PluviometrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluviometrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluviometrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
