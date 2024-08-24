import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesManagementRoutingModule } from './categories-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component'
import {SharedModule} from "../shared/shared.module";
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    CategoriesManagementRoutingModule,
    SharedModule,
    PrimeNgModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class CategoriesManagementModule { }
