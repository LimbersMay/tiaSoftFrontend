import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";
import {ProductsManagementModule} from "../../products-management/products-management.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateBillComponent } from './components/dialogs/create-bill/create-bill.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CategoryButtonComponent } from './components/dialogs/category-button/category-button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { SelectMenuComponent } from './components/dialogs/select-menu/select-menu.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CreateTableComponent } from './components/dialogs/create-table/create-table.component';


@NgModule({
  declarations: [
    CreateBillComponent,
    MainPageComponent,
    CategoryButtonComponent,
    ProductCardComponent,
    OrderCardComponent,
    SelectMenuComponent,
    OrderSummaryComponent,
    CreateTableComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    PrimeNgModule,
    NgOptimizedImage,
    ProductsManagementModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class MenuModule { }
