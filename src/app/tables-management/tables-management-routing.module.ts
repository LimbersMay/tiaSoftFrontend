import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SideNavLayoutComponent} from "../shared/layouts/side-nav-layout/side-nav-layout.component";
import {ListPageComponent} from "./pages/list-page/list-page.component";
import {OrdersPageComponent} from "./pages/orders-page/orders-page.component";

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
        path: ':id/orders',
        component: OrdersPageComponent,
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
