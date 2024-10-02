import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SideNavLayoutComponent} from "../shared/layouts/side-nav-layout/side-nav-layout.component";
import {ListPageComponent} from "./pages/list-page/list-page.component";
import {AccountsPageComponent} from "./pages/accounts-page/accounts-page.component";

const routes: Routes = [
  {
    path: '',
    component: SideNavLayoutComponent,
    children: [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesManagementRoutingModule { }
