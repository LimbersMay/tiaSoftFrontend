import {Product} from "./product.interface";
import {Category} from "../../categories-management/interfaces/category.interface";

export interface ProductResponse extends Omit<Product, 'category'> {
  category: Category;
}
