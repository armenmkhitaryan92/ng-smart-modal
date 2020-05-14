import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgSmartModalComponent } from './pages/ng-smart-modal/ng-smart-modal.component';
import {NgSmartModalModule} from '../../projects/ng-smart-modal/src/public-api';
import { FirstTestModalComponent } from './pages/ng-smart-modal/first-test-modal/first-test-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NgSmartModalComponent,
    FirstTestModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSmartModalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
