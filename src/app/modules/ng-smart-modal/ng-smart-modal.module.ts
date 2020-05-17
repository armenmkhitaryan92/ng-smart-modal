import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSmartModalRoutingModule } from './ng-smart-modal-routing.module';
import {NgSmartModalComponent} from './ng-smart-modal.component';
import {FirstTestModalComponent} from './first-test-modal/first-test-modal.component';
import {SecondTestModalComponent} from './second-test-modal/second-test-modal.component';

@NgModule({
  declarations: [
    NgSmartModalComponent,
    FirstTestModalComponent,
    SecondTestModalComponent
  ],
  imports: [
    CommonModule,
    NgSmartModalRoutingModule
  ]
})
export class NgSmartModalModule { }
