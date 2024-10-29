import {Component, Input} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";

@Component({
  selector: 'menu-not-selected-product',
  templateUrl: './not-selected-product.component.html',
  styles: ``
})
export class NotSelectedProductComponent {
  @Input({ required: true }) product!: ProductUI;
}
