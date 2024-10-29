import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListPageComponent} from "./pages/list-page/list-page.component";
import {ConfirmOrderPageComponent} from "./pages/confirm-order-page/confirm-order-page.component";

const routes: Routes = [
  {
    path: 'list',
    component: ListPageComponent,
    data: {
      routeIdx: 0
    }
  },
  {
    path: 'process-order',
    component: ConfirmOrderPageComponent,
    data: {
      routeIdx: 1
    }
  },
  {
    path: '**',
    redirectTo: 'list'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
