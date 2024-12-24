import {Injectable, signal} from '@angular/core';
import {ProductUI} from "../interfaces/product-ui.interface";

@Injectable()
export class ProductsInOrderService {

  public productsInOrder = signal<ProductUI[]>([]);

  addProductToCart(product: ProductUI) {
    // If the product is not in the cart, add it
    this.productsInOrder.update(products => [...products, product]);
  }

  public increaseProductQuantityBy(product: ProductUI, quantity: number) {
    this.productsInOrder.update(products => products.map(p => {
      if (p.productId === product.productId) {
        return {
          ...p,
          quantity: p.quantity += quantity,
        };
      }

      return p;
    }));
  }

  removeProductFromCart(product: ProductUI) {
    this.productsInOrder.update(products => products.filter(p => p.productId !== product.productId));
  }
}
