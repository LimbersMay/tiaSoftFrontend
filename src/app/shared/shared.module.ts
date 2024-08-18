import { NgModule } from '@angular/core';
import {SideNavLayoutComponent} from "./layouts/side-nav-layout/side-nav-layout.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {StyleClassModule} from "primeng/styleclass";


@NgModule({
  declarations: [
    SideNavLayoutComponent
  ],
  imports: [
    RouterOutlet,
    RouterLink,
    PrimeNgModule,
    StyleClassModule
  ],
  exports: [
    SideNavLayoutComponent
  ]
})
export class SharedModule { }
