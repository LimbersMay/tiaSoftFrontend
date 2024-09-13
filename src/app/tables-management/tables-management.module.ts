import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesManagementRoutingModule } from './tables-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListPageComponent
  ],
    imports: [
        CommonModule,
        TablesManagementRoutingModule,
        ReactiveFormsModule,
        PrimeNgModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class TablesManagementModule { }
