import {Component, inject, input, OnInit} from '@angular/core';
import {Order} from "../../interfaces/order.interface";
import {OrderStatuses} from "../../interfaces/OrderStatuses";
import {OrderProductItem} from "../../interfaces/OrderProductItem";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CancelOrderProductComponent} from "../dialogs/cancel-order-product/cancel-order-product.component";

@Component({
  selector: 'tables-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent {

  // Dialog
  private readonly dialogService = inject(DialogService);
  private ref: DynamicDialogRef | undefined;

  public order = input.required<Order>();

  public getOrderStatusClass(): string {
    switch (this.order().orderStatus.name) {
      case OrderStatuses.Activo:
        return 'bg-primary';
      case OrderStatuses.Pagado:
        return 'bg-green-500';
      case OrderStatuses.Cancelado:
        return 'bg-red-500';
      default:
        return 'bg-primary';
      }
  }

  public cancelOrderItem(orderItem: OrderProductItem): void {
    this.ref = this.dialogService.open(CancelOrderProductComponent, {
      header: 'Cancelar platillo',
      styleClass: 'p-fluid',
      data: {
        orderItem
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      },
    })
  }

  protected readonly OrderStatuses = OrderStatuses;
  protected readonly console = console;
}
