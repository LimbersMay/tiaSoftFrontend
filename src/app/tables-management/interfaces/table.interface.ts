import {User} from "../../auth/interfaces/user.interface";
import {Area} from "../../areas-management/interfaces/area.interface";
import {TableStatus} from "./tableStatus.interface";

export interface Table {
  tableId: string;
  name: string;
  user: User
  area: Area
  tableStatus: TableStatus;
}
