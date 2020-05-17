import {tap} from "rxjs/operators";
import {IModal, NgSmartModalService} from 'ng-smart-modal';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FirstTestModalComponent} from "./first-test-modal/first-test-modal.component";
import {SecondTestModalComponent} from "./second-test-modal/second-test-modal.component";

@Component({
  selector: 'app-ng-smart-modal',
  templateUrl: './ng-smart-modal.component.html',
  styleUrls: ['./ng-smart-modal.component.scss']
})
export class NgSmartModalComponent implements OnInit {

  @ViewChild('firstTemplateRef') firstTemplateRef: TemplateRef<any>;
  @ViewChild('secondTemplateRef') secondTemplateRef: TemplateRef<any>;

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

    modal.instance.close$
      .pipe(tap(() => console.log('First modal Event Works!')))
      .subscribe(() => this.ngSmartModalService.detach());

    modal.closeWrapper$
      .subscribe(() => console.log('First wrapper modal Event Works!'));

  }

  public openLongContentModal(): void {

    const modal: IModal<SecondTestModalComponent> = this.ngSmartModalService.attach(SecondTestModalComponent);

    modal.instance.close$
      .pipe(tap(() => console.log('Second modal Event Works!')))
      .subscribe(() => this.ngSmartModalService.detach());

    modal.closeWrapper$
      .subscribe(() => console.log('Second wrapper modal Event Works!'));
  }

  public openTemplateModal(): void {
    this.ngSmartModalService.attachTemplateRef(this.firstTemplateRef);
  }

  public openNestedTemplate(): void {
    this.ngSmartModalService.attachTemplateRef(this.secondTemplateRef);
    this.ngSmartModalService.setClass(['my-first-custom-class', 'my-second-custom-class'], 0);
    // this.ngSmartModalService.removeClass(['my-first-custom-class', 'my-second-custom-class'], 0);
  }

  public onClose(number: number) {
    this.ngSmartModalService.detach(number);
  }


}
