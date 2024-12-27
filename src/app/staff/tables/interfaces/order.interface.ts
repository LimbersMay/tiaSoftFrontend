import {User} from "../../../auth/interfaces/user.interface";
import {OrderStatus} from "./order-status.interface";
import {OrderProductItem} from "./OrderProductItem";

export interface Order {
  orderId: string;
  tableName: string;
  totalPrice: number;
  user: User;
  orderStatus: OrderStatus;
  products: OrderProductItem[];
  orderNumber: number;
  createdAt: string;
}
