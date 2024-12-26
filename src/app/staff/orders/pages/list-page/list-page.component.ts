import {Component, OnInit} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {FormBuilder} from "@angular/forms";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {Order} from "../../interfaces/order.interface";
import {OrdersService} from "../../services/orders.service";

enum OrderStatus {
  ACTIVO = 'ACTIVO',
  PAGADO = 'PAGADO',
  CANCELADO = 'CANCELADO'
}

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {

  public tableForm = this.fb.group({
    selectedTable: this.fb.control<Table | undefined>(undefined),
  })

  public orders: Order[] = [];
  public tables: Table[] = [];

  constructor(
    private readonly tableService: TablesService,
    private readonly ordersService: OrdersService,

    private readonly fb: FormBuilder,
  ) {}

  public selectTable(table: Table): void {
    this.tableForm.patchValue({selectedTable: table});
  }

  public getSeverity(status: string) {
    switch (status) {
      case OrderStatus.ACTIVO:
        return 'info';
      case OrderStatus.PAGADO:
        return 'success';
      default:
        return 'info';
    }
  }

  ngOnInit(): void {
    this.tableService.getTables().subscribe({
      next: (tables) => {
        this.tables = tables;
      }
    });

    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        console.log(orders);
        this.orders = orders;
      }
    })
  }
}
