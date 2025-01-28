import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {ButtonDirective} from "primeng/button";
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";
import { TableCardComponent } from './components/table-card/table-card.component';
import { TableDetailsComponent } from './components/table-details/table-details.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import {PrintBillComponent} from "./components/dialogs/print-bill/print-bill.component";
import { CancelOrderProductComponent } from './components/dialogs/cancel-order-product/cancel-order-product.component';


@NgModule({
  declarations: [
    ListPageComponent,
    TableCardComponent,
    TableDetailsComponent,
    OrderCardComponent,
    PrintBillComponent,
    CancelOrderProductComponent
  ],
    imports: [
        CommonModule,
        TablesRoutingModule,
        ButtonDirective,
        PrimeNgModule,
    ]
})
export class TablesModule { }
