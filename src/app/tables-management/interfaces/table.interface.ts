import {User} from "../../auth/interfaces/user.interface";
import {Area} from "../../areas-management/interfaces/area.interface";
import {TableStatus} from "./tableStatus.interface";
import {Bill} from "./bill.interface";

export interface Table {
  tableId: string;
  name: string;
  user: User
  area: Area
  tableStatus: TableStatus;
  paymentAuthorizedByUser: User;
  bills: Bill[];
}
