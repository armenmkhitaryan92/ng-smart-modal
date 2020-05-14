import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgModalWrapperComponent } from './ng-modal-wrapper.component';

describe('NgModalWrapperComponent', () => {
  let component: NgModalWrapperComponent;
  let fixture: ComponentFixture<NgModalWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgModalWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
