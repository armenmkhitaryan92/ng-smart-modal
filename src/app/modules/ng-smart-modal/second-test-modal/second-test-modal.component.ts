import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-second-test-modal',
  templateUrl: './second-test-modal.component.html',
  styleUrls: ['./second-test-modal.component.scss']
})
export class SecondTestModalComponent implements OnInit {

  public close$ = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
