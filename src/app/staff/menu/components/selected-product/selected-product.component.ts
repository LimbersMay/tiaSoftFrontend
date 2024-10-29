import {Component, Input} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";

@Component({
  selector: 'app-selected-product',
  templateUrl: './selected-product.component.html',
  styles: ``
})
export class SelectedProductComponent {
  @Input({ required: true }) product!: ProductUI;
  @Input({ required: true }) display!: boolean;
}
