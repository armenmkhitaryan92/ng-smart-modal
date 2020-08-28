import {timer} from 'rxjs';
import {delay, tap} from 'rxjs/operators';
import {IModal, NgSmartModalService} from 'ng-smart-modal';
import {Component, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FirstTestModalComponent} from './first-test-modal/first-test-modal.component';
import {SecondTestModalComponent} from './second-test-modal/second-test-modal.component';

@Component({
  selector: 'app-ng-smart-modal',
  templateUrl: './test-smart-modal.component.html',
  styleUrls: ['./test-smart-modal.component.scss']
})
export class TestSmartModalComponent implements OnInit {

  @ViewChild('firstTemplateRef') firstTemplateRef: TemplateRef<any> | undefined;
  @ViewChild('secondTemplateRef') secondTemplateRef: TemplateRef<any> | undefined;
  private firstModalClose$ = new EventEmitter<void>();

  constructor(
    private ngSmartModalService: NgSmartModalService
  ) {
  }

  ngOnInit(): void {
    this.openModal();
    this.openModal();
    this.openModal();
    timer(3000)
      .pipe(
        tap(() => this.ngSmartModalService.detach()),
        delay(500),
        tap(() => this.ngSmartModalService.detach()),
        delay(500),
      )
      .subscribe(() => {
        this.ngSmartModalService.detach();
      });

    this.firstModalClose$.subscribe();
  }

  public openModal(): void {
    const modal: IModal<FirstTestModalComponent> = this.ngSmartModalService.attach(FirstTestModalComponent,
      {
        inputs: {title: 'First Modal Works!'},   // object;
        outputs: {close$: this.firstModalClose$}, // object;
        class: 'my-custom-class',        // string | string[];
        ignoreWhenRouterChanged: false, // boolean;
        ignoreBackdropClick: false,    // boolean;
        ignoreBackdrop: false,        //  boolean;
        ignoreAnimation: false,      // boolean;
        ignoreEsc: false,           // boolean;
        topPosition: 'center'
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
    if (this.firstTemplateRef) {
      this.ngSmartModalService.attachTemplateRef(this.firstTemplateRef);
    }
  }

  public openNestedTemplate(): void {
    if (this.secondTemplateRef) {
      this.ngSmartModalService.attachTemplateRef(this.secondTemplateRef, {topPosition: 'center'});
      this.ngSmartModalService.setClass(['my-first-custom-class', 'my-second-custom-class'], 0);
      // this.ngSmartModalService.removeClass(['my-first-custom-class', 'my-second-custom-class'], 0);
    }
  }

  public onClose(number: number) {
    this.ngSmartModalService.detach(number);
  }

}
