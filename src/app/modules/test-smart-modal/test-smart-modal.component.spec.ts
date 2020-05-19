import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSmartModalComponent } from './test-smart-modal.component';

describe('NgSmartModalComponent', () => {
  let component: TestSmartModalComponent;
  let fixture: ComponentFixture<TestSmartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSmartModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSmartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
