import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondTestModalComponent } from './second-test-modal.component';

describe('SecondTestModalComponent', () => {
  let component: SecondTestModalComponent;
  let fixture: ComponentFixture<SecondTestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondTestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
