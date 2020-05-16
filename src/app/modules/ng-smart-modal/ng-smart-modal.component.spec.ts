import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSmartModalComponent } from './ng-smart-modal.component';

describe('NgSmartModalComponent', () => {
  let component: NgSmartModalComponent;
  let fixture: ComponentFixture<NgSmartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSmartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSmartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
