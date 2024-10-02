import {Product} from "../../../products-management/interfaces/product.interface";

export interface ProductUI extends Product {
  isSelected: boolean;
  quantity: number;
  visible: boolean;
}
