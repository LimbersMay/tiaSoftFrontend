import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {NewAccountPageComponent} from "./pages/new-account-page/new-account-page.component";
import {LayoutPageComponent} from "./layouts/layout-page/layout-page.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutPageComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'new-account',
        component: NewAccountPageComponent
      },
      {
        path: "**",
        redirectTo: "login"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
