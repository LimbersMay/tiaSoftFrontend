import {Component, input, OnInit} from '@angular/core';
import {Order} from "../../interfaces/order.interface";
import {OrderStatuses} from "../../interfaces/OrderStatuses";

@Component({
  selector: 'tables-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss'
})
export class OrderCardComponent implements OnInit {
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

  public ngOnInit(): void {
    console.log(this.order().products);
  }

  protected readonly OrderStatuses = OrderStatuses;
}
