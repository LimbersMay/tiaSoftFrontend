import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BillUI} from "../../../tables-management/interfaces/bill.interface";
import {ProductUI} from "../interfaces/product-ui.interface";

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private billsSubject = new BehaviorSubject<BillUI[]>([]);
  private selectedBillSubject = new BehaviorSubject<BillUI | undefined>(undefined);

  public bills$ = this.billsSubject.asObservable();
  public selectedBill$ = this.selectedBillSubject.asObservable();

  constructor() { }

  public setBills(bills: BillUI[]): void {
    this.billsSubject.next(bills);
  }

  public setSelectedBill(bill: BillUI): void {
    this.selectedBillSubject.next(bill);
  }

  addProductToBill(product: ProductUI) {
    const currentBill = this.selectedBillSubject.value;
    if (!currentBill) return;

    // Update the quantity of the product if it already exists in the bill
    const existingProduct = currentBill.items.find(item => item.productId === product.productId);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      currentBill.items.push({...product, quantity: 1, isSelected: true});
    }

    currentBill.total += product.price;
    this.updateBill(currentBill);
  }

  removeProductFromBill(product: ProductUI) {
    const currentBill = this.selectedBillSubject.value;
    if (!currentBill) return;

    const itemIndex = currentBill.items.findIndex(item => item.productId === product.productId);
    if (itemIndex >= 0) {
      const item = currentBill.items[itemIndex];
      item.quantity -= 1;
      currentBill.total -= product.price;

      if (item.quantity <= 0) {
        currentBill.items.splice(itemIndex, 1);
      }
    }

    this.updateBill(currentBill);
  }

  private updateBill(bill: BillUI) {
    const bills = this.billsSubject.value;
    const index = bills.findIndex(b => b.billId === bill.billId);
    if (index >= 0) {
      bills[index] = bill;
      this.billsSubject.next([...bills]); // Update the bills list
    }
  }

}
