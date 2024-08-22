import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {SharedModule} from "../shared/shared.module";
import { UsersListComponent } from './pages/users-list/users-list.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    UsersListComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UsersManagementRoutingModule,
    PrimeNgModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class UsersManagementModule { }
