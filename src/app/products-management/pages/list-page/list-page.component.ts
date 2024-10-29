import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Product} from "../../interfaces/product.interface";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {Category} from "../../../categories-management/interfaces/category.interface";
import {CategoriesService} from "../../../categories-management/services/categories.service";
import {MessageService} from "primeng/api";
import {FileUpload} from "primeng/fileupload";
import {environments} from "../../../../../environments/environments";
import {ErrorService} from "../../../shared/services/error.service";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public products: Product[] = [];
  public categories: Category[] = [];
  public display: boolean = false;

  @ViewChild('fileUpload') fileInput!: FileUpload;

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
    private readonly messageService: MessageService,
    private readonly errorService: ErrorService
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

          this.messageService.add({
            severity: 'success',
            summary: 'Producto creado',
            detail: 'Producto creado correctamente'
          });

          // If the file input has files, update the product image
          if (this.fileInput.hasFiles()) {
            this.uploadImage(product);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });

      return;
    }

    this.productsService.updateProduct(this.currentProduct).subscribe({
      next: (product: Product) => {

        // Update the product in the products array
        this.products = this.products.map(p => p.productId === product.productId ? product : p);

        // Show a success message
        this.messageService.add({
          severity: 'success',
          summary: 'Producto actualizado',
          detail: 'Producto actualizado correctamente'
        });

        // If the file input has files, update the product image
        if (this.fileInput.hasFiles()) {
          this.uploadImage(product);
        }
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.closeDialog();
      }
    })
  }

  public uploadImage(product: Product) {
    this.productsService.updateProductImage(product.productId, this.fileInput.files[0]).subscribe({
      next: (result) => {
        this.fileInput.clear();
        // Update the product image URL in the products array
        this.products = this.products.map(p => {
          if (p.productId === product.productId) {
            p.imageUrl = result.imagePath;
          }

          return p;
        });
      },
      error: (err) => {
        const errorMessage = this.errorService.getErrorMessage(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar la imagen',
          detail: errorMessage
        });
      },
      complete: () => {
        this.fileInput.clear();
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
