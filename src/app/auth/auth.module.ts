import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {NewAccountPageComponent} from "./pages/new-account-page/new-account-page.component";
import { LayoutPageComponent } from './layouts/layout-page/layout-page.component';


@NgModule({
  declarations: [
    NewAccountPageComponent,
    LoginPageComponent,
    LayoutPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimeNgModule
  ]
})
export class AuthModule { }
