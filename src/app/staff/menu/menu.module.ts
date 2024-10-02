import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {InputTextModule} from "primeng/inputtext";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";
import { ConfirmOrderPageComponent } from './pages/confirm-order-page/confirm-order-page.component';


@NgModule({
  declarations: [
    ListPageComponent,
    ConfirmOrderPageComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PrimeNgModule,
    NgOptimizedImage
  ]
})
export class MenuModule { }
