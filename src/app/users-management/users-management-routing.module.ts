import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersListComponent} from "./pages/users-list/users-list.component";

const routes: Routes = [
  {
    path: 'list',
    component: UsersListComponent
  },
  {
    path: "**",
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersManagementRoutingModule { }
