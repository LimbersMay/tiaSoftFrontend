import {Component, OnInit} from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Product} from "../../interfaces/product.interface";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {Category} from "../../../categories-management/interfaces/category.interface";
import {CategoriesService} from "../../../categories-management/services/categories.service";
import {MenuItem} from "primeng/api";

interface CategoryItem {
  code: string;
  name: string;
}

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public products: Product[] = [];
  public categories: Category[] = [];
  public display: boolean = false;

  public productForm = this.fb.nonNullable.group({
    productId: [''],
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    isAvailable: [false],
    description: [''],
    imageUrl: [''],
    categoryId: ['', Validators.required]
  });

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService,
  ) {}

  public showDialog(product?: Product): void {
    this.display = true;

    if (!product) return;

    this.productForm.reset(product);
  }

  public closeDialog(): void {
    this.display = false;
    this.productForm.reset();
  }

  public get currentProduct(): Product {
    return this.productForm.value as Product;
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.productForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.productForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.productForm, field);
  }

  public onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.productForm.value.productId) {
      this.productsService.createProduct(this.currentProduct).subscribe({
        next: (product: Product) => {

          const category = this.categories.find((category) => category.categoryId === product.categoryId);
          product.category = category?.name || '';

          this.products.unshift(product);
          this.closeDialog();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

    this.productsService.updateProduct(this.currentProduct).subscribe({
      next: (product: Product) => {
        const index = this.products.findIndex((p) => p.productId === product.productId);
        this.products[index] = product;
        this.closeDialog();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnInit() {
    this.productsService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        },
      error: (err) => {
        console.error(err);
      }
    });

    this.categoriesService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
