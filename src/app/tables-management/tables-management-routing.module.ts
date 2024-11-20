import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListPageComponent} from "./pages/list-page/list-page.component";
import {AccountsPageComponent} from "./pages/accounts-page/accounts-page.component";

const routes: Routes = [
  {
    path: 'list',
    component: ListPageComponent
  },
  {
    path: ':id/accounts',
    component: AccountsPageComponent,
  },
  {
    path: '**',
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesManagementRoutingModule { }
