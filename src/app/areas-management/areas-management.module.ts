import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasManagementRoutingModule } from './areas-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {SharedModule} from "../shared/shared.module";
import {HttpClientModule} from "@angular/common/http";
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    AreasManagementRoutingModule,
    SharedModule,
    HttpClientModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AreasManagementModule { }
