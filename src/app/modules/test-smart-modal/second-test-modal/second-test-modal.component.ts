import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-second-test-modal',
  templateUrl: './second-test-modal.component.html',
  styleUrls: ['./second-test-modal.component.scss']
})
export class SecondTestModalComponent implements OnInit, OnDestroy {

  public close$ = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('SecondTestModalComponent destroyed');
  }

}
