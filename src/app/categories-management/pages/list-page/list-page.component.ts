import {Component, OnInit} from '@angular/core';
import {Category} from "../../interfaces/category.interface";
import {CategoriesService} from "../../services/categories.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit{

  public categories!: Category[];
  public display!: boolean;

  public categoryForm = this.fb.group({
    categoryId: [''],
    name: ['', Validators.required],
    description: ['']
  })

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService,
    private readonly messageService: MessageService
  ) {}

  public get currentCategory(): Category {
    return this.categoryForm.value as Category;
  }

  public showDialog(category?: Category) {
    this.display = true;

    if (!category) return;

    this.categoryForm.reset(category);
  }

  public closeDialog(): void {
    this.display = false;
    this.categoryForm.reset();
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.categoryForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.categoryForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.categoryForm, field);
  }

  public onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (!this.currentCategory.categoryId) {
      return this.categoriesService.createCategory(this.currentCategory).subscribe({
        next: category => {
          this.categories.unshift(category);
          this.closeDialog();

          this.messageService.add({
            severity: 'success',
            summary: 'Categoria creada',
            detail: 'Categoria creada correctamente'
          });
        },
        error: () => this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al crear la categoría'
        })
      });
    }

    return this.categoriesService.updateCategory(this.currentCategory).subscribe({
      next: category => {
        const index = this.categories.findIndex(c => c.categoryId === category.categoryId);
        this.categories[index] = category;
        this.closeDialog();

        this.messageService.add({
          severity: 'success',
          summary: 'Categoria actualizada',
          detail: 'Categoria actualizada correctamente'
        });
      },
      error: () => this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al actualizar la categoría'
      })
    });
  }

  public ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: categories => this.categories = categories,
      error: err => console.error()
    });
  }
}
