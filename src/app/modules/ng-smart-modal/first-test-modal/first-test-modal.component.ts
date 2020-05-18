import {Component, EventEmitter, OnInit} from '@angular/core';
import {SecondTestModalComponent} from '../second-test-modal/second-test-modal.component';
import {tap} from 'rxjs/operators';
import {IModal, NgSmartModalService} from 'ng-smart-modal';


@Component({
  selector: 'app-first-test-modal',
  templateUrl: './first-test-modal.component.html',
  styleUrls: ['./first-test-modal.component.scss']
})
export class FirstTestModalComponent implements OnInit {

  public close$ = new EventEmitter<void>();

  constructor(
    private ngSmartModalService: NgSmartModalService
  ) {
  }

  ngOnInit(): void {
  }

  public openLongContentModal(): void {

    const modal: IModal<SecondTestModalComponent> = this.ngSmartModalService.attach(SecondTestModalComponent);

    modal.instance.close$
      .pipe(tap(() => console.log('Second modal Event Works!')))
      .subscribe(() => this.ngSmartModalService.detach());

    modal.closeWrapper$
      .subscribe(() => console.log('Second wrapper modal Event Works!'));
  }

}