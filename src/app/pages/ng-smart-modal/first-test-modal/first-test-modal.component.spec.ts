import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTestModalComponent } from './first-test-modal.component';

describe('FirstTestModalComponent', () => {
  let component: FirstTestModalComponent;
  let fixture: ComponentFixture<FirstTestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
