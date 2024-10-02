import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersManagementRoutingModule } from './orders-management-routing.module';
import { ListPageComponent } from './pages/list-page.component';


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    OrdersManagementRoutingModule
  ]
})
export class OrdersManagementModule { }
