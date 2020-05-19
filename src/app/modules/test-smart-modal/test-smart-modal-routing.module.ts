import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestSmartModalComponent} from './test-smart-modal.component';

const routes: Routes = [
  {path: '', redirectTo: 'test-smart-modal', pathMatch: 'full'},
  {path: 'test-smart-modal', component: TestSmartModalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestSmartModalRoutingModule { }
