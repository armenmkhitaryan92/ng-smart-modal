import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-first-test-modal',
  templateUrl: './first-test-modal.component.html',
  styleUrls: ['./first-test-modal.component.scss']
})
export class FirstTestModalComponent implements OnInit {

  public event$ = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
