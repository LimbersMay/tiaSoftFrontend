import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesService} from "../../../../categories-management/services/categories.service";
import {Category} from "../../../../categories-management/interfaces/category.interface";
import {Product} from "../../../../products-management/interfaces/product.interface";
import {ProductsService} from "../../../../products-management/services/products.service";
import {ProductUI} from "../../interfaces/product-ui.interface";


interface Order {
  totalProducts: number;
  totalPrice: number;
}

@Component({
  selector: 'app-list-page-component',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css'],
})
export class ListPageComponent implements OnInit {

  public category: string = '';
  public categories: Category[] = [];
  public products: ProductUI[] = []
  public bills = [
    {
      name: 'Cuenta 1',
      value: 'Cuenta1'
    }
  ]

  constructor(
    private readonly route: ActivatedRoute,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
  ) {}

  public get selectedProductsInfo(): Order {
    const selectedProducts = this.products.filter((product: ProductUI) => product.isSelected);

    const totalPrice = selectedProducts.reduce((acc: number, product: ProductUI) => acc + product.price * product.quantity, 0);
    const totalProducts = selectedProducts.reduce((acc: number, product: ProductUI) => acc + product.quantity, 0);

    return {
      totalProducts,
      totalPrice,
    };
  }

  public processOrder() {
    const productsToProcess = this.products.filter((product: ProductUI) => product.isSelected);
    localStorage.setItem('order', JSON.stringify(productsToProcess));
    this.router.navigate(['/staff/menu/process-order']);
  }

  public filterProducts(categoryId: string) {
    if (categoryId === 'todo') {
      this.products.forEach((product: ProductUI) => {
        product.visible = true;
      });
      return;
    }

    this.products.forEach((product: ProductUI) => {
      product.visible = product.categoryId === categoryId;
    });
  }

  public filterProductsByName(name: string) {
    this.products.forEach((product: ProductUI) => {
      // Filter with regex
      const regex = new RegExp(name, 'i');
      product.visible = regex.test(product.name);
    });
  }

  // Card methods
  public selectProduct(product: ProductUI) {
    if (product.isSelected && product.quantity <= 0) {
      product.isSelected = false;
      return;
    }

    product.isSelected = true;
  }

  public increaseQuantity(product: ProductUI) {
    product.quantity = product.quantity + 1;
  }

  public decreaseQuantity(product: ProductUI) {
    if (product.quantity > 0) {
      product.quantity--;
    }

    if (product.quantity <= 0) {
      product.isSelected = false;
      product.quantity = 1;
    }
  }

  public getActiveClass(category?: string) {
    const activeClass = "border-primary-500 bg-primary-50 border-2 text-primary";

    if (category === this.category) {
      return activeClass;
    }

    if (!this.category && category == 'todo') {
      return activeClass;
    }

    return "border-300 bg-white text-600";
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
    });

    this.categoriesService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.productsService.getProducts().subscribe(products => {
      this.products = products.map((product: Product) => ({
        ...product,
        isSelected: false,
        quantity: 1,
        visible: true,
      }));
    })
  }
}
