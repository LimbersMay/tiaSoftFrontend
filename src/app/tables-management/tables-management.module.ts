import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesManagementRoutingModule } from './tables-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AccountsPageComponent } from './pages/accounts-page/accounts-page.component';
import { PaymentAuthorizationComponent } from './components/dialogs/payment-authorization/payment-authorization.component';
import { PrintBillComponent } from './components/dialogs/print-bill/print-bill.component';
import { EditTableComponent } from './components/dialogs/edit-table/edit-table.component';
import { CreateOrderComponent } from './components/dialogs/create-order/create-order.component';


@NgModule({
    declarations: [
        ListPageComponent,
        AccountsPageComponent,
        PaymentAuthorizationComponent,
        PrintBillComponent,
        EditTableComponent,
        CreateOrderComponent,
    ],
  exports: [
    EditTableComponent,
    PrintBillComponent
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
