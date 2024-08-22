import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SideNavLayoutComponent} from "../shared/layouts/side-nav-layout/side-nav-layout.component";
import {UsersListComponent} from "./pages/users-list/users-list.component";

const routes: Routes = [
  {
    path: '',
    component: SideNavLayoutComponent,
    children: [
      {
        path: 'list',
        component: UsersListComponent
      },
      {
        path: "**",
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule { }
