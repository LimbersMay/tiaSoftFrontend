import {Component, input, output} from '@angular/core';
import {CategoryUi} from "../../../../../categories-management/interfaces/category-ui.interface";

@Component({
  selector: 'menu-category-button',
  templateUrl: './category-button.component.html',
  styleUrl: './category-button.component.scss'
})
export class CategoryButtonComponent {

  public category = input.required<CategoryUi>();

  public onSelectCategory = output<CategoryUi>();

  constructor() {}

  public selectCategoryButton() {
    this.onSelectCategory.emit(this.category());
  }
}
