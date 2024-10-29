import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsManagementRoutingModule } from './products-management-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import {SharedModule} from "../shared/shared.module";
import {PrimeNgModule} from "../prime-ng/prime-ng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/fileupload";
import { ServerImageUrlPipe } from './pipes/server-image-url.pipe';


@NgModule({
  declarations: [
    ListPageComponent,
    ServerImageUrlPipe
  ],
    imports: [
        CommonModule,
        ProductsManagementRoutingModule,
        SharedModule,
        PrimeNgModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule
    ],
  exports: [
    ServerImageUrlPipe
  ]
})
export class ProductsManagementModule { }
