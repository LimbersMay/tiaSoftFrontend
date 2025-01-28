import {Component, inject, OnInit} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from "primeng/dynamicdialog";
import {OrderProductItem} from "../../../interfaces/OrderProductItem";

@Component({
  selector: 'app-cancel-order-product',
  templateUrl: './cancel-order-product.component.html',
  styleUrl: './cancel-order-product.component.scss'
})
export class CancelOrderProductComponent implements OnInit {

  // Properties
  public orderItem: OrderProductItem | undefined;

  // Services
  private dialogService = inject(DialogService);

  public instance: DynamicDialogComponent | undefined;

  constructor(public ref: DynamicDialogRef) {
    this.instance = this.dialogService.getInstance(this.ref);
  }

  public close(): void {
    this.ref.close();
  }

  public submit(): void {

  }

  public ngOnInit() {
    if (this.instance && this.instance.data) {
      const orderItem = this.instance.data['orderItem'] as OrderProductItem;

      if (!orderItem) {
        return;
      }

      this.orderItem = orderItem;
    }
  }
}
