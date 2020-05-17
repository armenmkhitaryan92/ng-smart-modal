import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NgSmartModalComponent} from './ng-smart-modal.component';

const routes: Routes = [
  {path: '', redirectTo: 'ng-smart-modal', pathMatch: 'full'},
  {path: 'ng-smart-modal', component: NgSmartModalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgSmartModalRoutingModule { }
