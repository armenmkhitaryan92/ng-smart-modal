import { TestBed } from '@angular/core/testing';

import { NgSmartModalService } from './ng-smart-modal.service';

describe('NgSmartModalService', () => {
  let service: NgSmartModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgSmartModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
