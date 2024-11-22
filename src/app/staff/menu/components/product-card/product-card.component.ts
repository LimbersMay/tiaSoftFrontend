import {Component, input} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";

@Component({
  selector: 'menu-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input.required<ProductUI>();
}
