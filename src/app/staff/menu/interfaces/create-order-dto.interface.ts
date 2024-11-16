import {BillUI} from "../../../tables-management/interfaces/bill.interface";

export interface CreateOrderDto {
  bills: BillUI[];
  additionalInfo: string | undefined | null;
  customerName: string | undefined | null;
  areaId: string;
}
