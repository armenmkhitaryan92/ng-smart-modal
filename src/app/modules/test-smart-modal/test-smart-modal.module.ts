import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestSmartModalRoutingModule } from './test-smart-modal-routing.module';
import {TestSmartModalComponent} from './test-smart-modal.component';
import {FirstTestModalComponent} from './first-test-modal/first-test-modal.component';
import {SecondTestModalComponent} from './second-test-modal/second-test-modal.component';

@NgModule({
  declarations: [
    TestSmartModalComponent,
    FirstTestModalComponent,
    SecondTestModalComponent
  ],
  imports: [
    CommonModule,
    TestSmartModalRoutingModule
  ]
})
export class TestSmartModalModule { }
