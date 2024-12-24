import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CategoriesService} from "../../../../categories-management/services/categories.service";
import {Category} from "../../../../categories-management/interfaces/category.interface";
import {CategoryUi} from "../../../../categories-management/interfaces/category-ui.interface";
import {ProductUI} from "../../interfaces/product-ui.interface";
import {Product} from "../../../../products-management/interfaces/product.interface";
import {ProductsService} from "../../../../products-management/services/products.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {SelectMenuComponent} from "../../components/dialogs/select-menu/select-menu.component";
import {ProductsInOrderService} from "../../services/products-in-order.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [ProductsInOrderService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnInit, OnDestroy {

  // Services
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private dialogService = inject(DialogService);
  private productsInOrderService = inject(ProductsInOrderService);

  // Properties
  public categories = signal<CategoryUi[]>([]);
  public products = signal<ProductUI[]>([]);

  public productsInOrder = this.productsInOrderService.productsInOrder.asReadonly();

  public ref: DynamicDialogRef | undefined;

  public selectCategory(category: CategoryUi) {
    this.categories.update(categories => categories.map(cat => ({
      ...cat,
      isSelected: cat.categoryId === category.categoryId
    })));

    if (category.categoryId === 'Todo') {
      this.products.update(products => products.map(product => ({
        ...product,
        visible: true
      })));

      return;
    }

    this.products.update(products => products.map(product => ({
      ...product,
      visible: product.categoryId === category.categoryId
    })));
  }

  public openMenuDialog(selectedProduct: ProductUI) {
    this.ref = this.dialogService.open(SelectMenuComponent, {
      header: 'Seleccionar producto',
      data: {
        selectedProduct: structuredClone(selectedProduct)
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      },
    });

    this.ref.onClose.subscribe((updatedProduct: ProductUI) => {
      if (updatedProduct) {
        // If the product is already in the cart, increase its quantity
        if (this.productsInOrder().some(p => p.productId === updatedProduct.productId)) {
          this.productsInOrderService.increaseProductQuantityBy(updatedProduct, updatedProduct.quantity);
          return;
        }

        // If the product is not in the cart, add it
        this.productsInOrderService.addProductToCart(updatedProduct);
      }
    });
  }

  public ngOnInit() {
    // Get categories
    this.loadCategories();

    // Get products
    this.loadProducts();
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe((categories: Category[]) => {
      const categoriesMapped = categories.map(category => ({
        ...category,
        isSelected: false
      }));

      categoriesMapped.unshift({
        categoryId: 'Todo',
        icon: 'fa-solid fa-utensils',
        name: 'Todo',
        description: 'Todas las categorías',
        isSelected: false
      })

      this.categories.set(categoriesMapped);
    });
  }

  private loadProducts() {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      const productsMapped = products.map(product => ({
        ...product,
        isSelected: false,
        quantity: 1,
        visible: true,
      }));

      this.products.set(productsMapped);
    });
  }

  public ngOnDestroy() {
    this.ref?.close();
  }
}
