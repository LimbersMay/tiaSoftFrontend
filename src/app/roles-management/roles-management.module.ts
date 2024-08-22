import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesManagementRoutingModule } from './roles-management-routing.module';
import {SharedModule} from "../shared/shared.module";
import { ListPageComponent } from './pages/list-page/list-page.component';
import {Button, ButtonDirective} from "primeng/button";
import {PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    RolesManagementRoutingModule,
    SharedModule,
    Button,
    ButtonDirective,
    PrimeTemplate,
    Ripple,
    TableModule,
    TagModule
  ]
})
export class RolesManagementModule { }
