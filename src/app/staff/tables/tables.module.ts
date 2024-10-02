import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {ButtonDirective} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {PrimeNgModule} from "../../prime-ng/prime-ng.module";
import {SpeedDialModule} from "primeng/speeddial";


@NgModule({
  declarations: [
    ListPageComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    ButtonDirective,
    PrimeNgModule,
    SpeedDialModule
  ]
})
export class TablesModule { }
