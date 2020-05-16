import {Component, OnInit, ViewChild} from '@angular/core';
import {FirstTestModalComponent} from "./first-test-modal/first-test-modal.component";
import {NgSmartModalService, IModal} from '../../../../projects/ng-smart-modal/src/public-api';

@Component({
  selector: 'app-ng-smart-modal',
  templateUrl: './ng-smart-modal.component.html',
  styleUrls: ['./ng-smart-modal.component.scss']
})
export class NgSmartModalComponent implements OnInit {

  @ViewChild('templateRef') templateRef: any;
  @ViewChild('ref') ref: any;

  constructor(
    private ngSmartModalService: NgSmartModalService
  ) {
  }

  ngOnInit(): void {
  }

  public openModal(): void {
    const modal: IModal<FirstTestModalComponent> = this.ngSmartModalService.attach(FirstTestModalComponent,
      {
        inputs: {},   // object;
        outputs: {}, // object;
        class: 'my-custom-class',        // string | string[];
        ignoreWhenRouterChanged: false, // boolean;
        ignoreBackdropClick: false,    // boolean;
        ignoreBackdrop: false,        //  boolean;
        ignoreAnimation: false,      // boolean;
        ignoreEsc: false,           // boolean;
      }
    );

    modal.instance.event$.subscribe();
    modal.closeWrapper$.subscribe()

  }

  openSecond() {
    this.ngSmartModalService.attachTemplateRef(this.ref);
  }

}
