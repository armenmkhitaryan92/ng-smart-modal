import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'lib-ng-modal-wrapper',
  templateUrl: './ng-modal-wrapper.component.html',
  styleUrls: ['./ng-modal-wrapper.component.scss']
})
export class NgModalWrapperComponent implements OnInit {

  public close$ = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
