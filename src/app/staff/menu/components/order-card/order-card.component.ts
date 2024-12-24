import {Component, inject, input} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";
import {ProductsInOrderService} from "../../services/products-in-order.service";

@Component({
  selector: 'menu-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {
  public product = input.required<ProductUI>();

  public productsInCart = inject(ProductsInOrderService);

  public increaseQuantity() {
    this.productsInCart.increaseProductQuantityBy(this.product(), 1);
  }

  public decreaseQuantity() {
    if (this.product().quantity === 1) {
      this.productsInCart.removeProductFromCart(this.product());
      return;
    }

    this.productsInCart.increaseProductQuantityBy(this.product(), -1);
  }
}
