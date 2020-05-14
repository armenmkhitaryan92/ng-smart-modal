import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NgSmartModalComponent} from "./pages/ng-smart-modal/ng-smart-modal.component";


const routes: Routes = [
  {path: '', redirectTo: 'ng-smart-modal', pathMatch: 'full'},
  {path: 'ng-smart-modal', component: NgSmartModalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
