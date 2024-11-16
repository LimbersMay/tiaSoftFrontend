import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";


@NgModule({
  declarations: [
    ListPageComponent
  ],
    imports: [
        CommonModule,
        OrdersRoutingModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
      PrimeNgModule
    ]
})
export class OrdersModule { }
