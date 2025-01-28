import {Component, inject, input, OnChanges, signal, SimpleChanges} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TableStatus} from "../../../../tables-management/enums/table-status.enum";
import {OrdersService} from "../../services/orders.service";
import {Order} from "../../interfaces/order.interface";
import {OrderStatuses} from "../../interfaces/OrderStatuses";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {PrintBillComponent} from "../dialogs/print-bill/print-bill.component";
import {Router} from "@angular/router";

@Component({
  selector: 'tables-table-details',
  templateUrl: './table-details.component.html',
  styleUrl: './table-details.component.scss'
})
export class TableDetailsComponent implements OnChanges {

  // Services
  private ordersService = inject(OrdersService);
  private tablesService = inject(TablesService);

  private router = inject(Router);

  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  // Inputs
  public table = input<Table | null>(null);

  // Properties
  public orders = signal<Order[]>([]);

  public totalFromAllOrders(): number {
    return this.orders()
      .filter(order => order.orderStatus.name !== OrderStatuses.Cancelado)
      .reduce((total, order) => total + order.totalPrice, 0);
  }

  public isPendingAuthorization(): boolean {
    return this.table()?.tableStatus?.name === TableStatus.PorAutorizar;
  }

  /**
   * The table can be sent to the cashier if:
   * 1. It has orders
   * 2. It is not pending authorization
   */
  public canBeSentToCashier(): boolean {
    return this.orders().length > 0 && !this.isPendingAuthorization();
  }

  public sendTableToCashier(): void {
    if (!this.table()) {
      return;
    }

    this.tablesService.sendTableToCashier(this.table()!.tableId).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Mesa enviada', detail: 'La mesa ha sido enviada a caja correctamente'});
      }
    })
  }

  public createNewOrder(): void {
    if (!this.table()) {
      return;
    }

    this.router.navigate(['staff', 'menu', 'list'], {queryParams: {tableId: this.table()!.tableId}});
  }

  public printTableBill(): void {
    this.ref = this.dialogService.open(PrintBillComponent, {
      header: 'Selecciona el área de impresión',
      styleClass: 'p-fluid',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      }
    });
  }

  public getTableStatusClass(): string {
    switch (this.table()?.tableStatus?.name) {
      case TableStatus.Activo:
        return 'bg-primary';
      case TableStatus.PorAutorizar:
        return 'bg-orange-500'
      case TableStatus.Pagado:
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    const table = changes['table'].currentValue as Table;

    if (!table) {
      return;
    }

    this.ordersService.getOrdersByTableId(table.tableId)
      .subscribe(orders => {
        this.orders.set(orders);
      });
  }
}
