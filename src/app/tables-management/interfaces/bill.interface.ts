import {ProductUI} from "../../staff/menu/interfaces/product-ui.interface";

export interface Bill {
  billId: string;
  name: string;
  total: number;
  tableId: string;
}

export interface BillUI extends Bill{
  items: ProductUI[];
}
