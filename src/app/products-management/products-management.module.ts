import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsManagementRoutingModule } from './products-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {SharedModule} from "../shared/shared.module";
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    ProductsManagementRoutingModule,
    SharedModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductsManagementModule { }
