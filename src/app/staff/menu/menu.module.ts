import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";
import { ConfirmOrderPageComponent } from './pages/confirm-order-page/confirm-order-page.component';
import {ProductsManagementModule} from "../../products-management/products-management.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SelectedProductComponent } from './components/selected-product/selected-product.component';
import { NotSelectedProductComponent } from './components/not-selected-product/not-selected-product.component';
import { CreateBillComponent } from './components/dialogs/create-bill/create-bill.component';
import {DividerModule} from "primeng/divider";


@NgModule({
  declarations: [
    ListPageComponent,
    ConfirmOrderPageComponent,
    SelectedProductComponent,
    NotSelectedProductComponent,
    CreateBillComponent
  ],
    imports: [
        CommonModule,
        MenuRoutingModule,
        PrimeNgModule,
        NgOptimizedImage,
        ProductsManagementModule,
        ReactiveFormsModule,
        DividerModule,
        FormsModule
    ]
})
export class MenuModule { }
