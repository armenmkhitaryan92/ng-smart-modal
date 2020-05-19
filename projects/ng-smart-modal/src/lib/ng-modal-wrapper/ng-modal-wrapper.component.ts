import {Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'ng-modal-wrapper',
  template: `
    <div class="slide popup">
      <div class="slide_modal" (click)="close$.emit()"></div>
      <div class="slide_popup"></div>
    </div>`,
  styleUrls: ['./ng-modal-wrapper.component.scss']
})
export class NgModalWrapperComponent {
  public close$ = new EventEmitter<void>();
}

