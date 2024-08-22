import { NgModule } from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {DialogModule} from "primeng/dialog";
import {MultiSelectModule} from "primeng/multiselect";
import {ToastModule} from "primeng/toast";



@NgModule({
  declarations: [],
  imports: [],
  exports: [
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TagModule,
    DialogModule,
    MultiSelectModule,
    ToastModule
  ]
})
export class PrimeNgModule { }
