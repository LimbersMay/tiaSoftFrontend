import {User} from "../../../auth/interfaces/user.interface";
import {OrderStatus} from "./order-status.interface";
import {Product} from "../../../products-management/interfaces/product.interface";

export interface Order {
  orderId: string;
  tableName: string;
  totalPrice: number;
  user: User;
  orderStatus: OrderStatus;
  products: Product[];
  orderNumber: number;
}
