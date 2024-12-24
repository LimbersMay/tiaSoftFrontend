import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductUI} from "../../../interfaces/product-ui.interface";
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'menu-select-menu-dialog',
  templateUrl: './select-menu.component.html',
  styleUrl: './select-menu.component.scss'
})
export class SelectMenuComponent implements OnInit, OnDestroy {

  public selectedProduct!: ProductUI;
  public instance: DynamicDialogComponent | undefined;

  constructor(public ref: DynamicDialogRef, private dialogService: DialogService) {
    this.instance = this.dialogService.getInstance(this.ref);
  }

  public increment() {
    this.selectedProduct.quantity++;
  }

  public decrement() {
    if (this.selectedProduct.quantity > 1) {
      this.selectedProduct.quantity--;
    }
  }

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.selectedProduct = this.instance.data['selectedProduct'];
    }
  }

  close() {
    this.ref.close();
  }

  public addProduct() {
    this.ref.close(this.selectedProduct);
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
