import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, map} from "rxjs";
import {Bill, BillUI} from "../../../tables-management/interfaces/bill.interface";
import {ProductUI} from "../interfaces/product-ui.interface";

@Injectable({
  providedIn: 'root'
})
export class BillsStateService {

  // Subjects to store the state of the bills and products
  private billsSubject = new BehaviorSubject<BillUI[]>([]);
  private selectedBillSubject = new BehaviorSubject<BillUI | undefined>(undefined);
  private productsSubject = new BehaviorSubject<ProductUI[]>([]);

  // Filter subjects
  private categoryFilterSubject = new BehaviorSubject<string>('todo');
  private nameFilterSubject = new BehaviorSubject<string>('');

  // Observables to expose the state of the bills and products
  public bills$ = this.billsSubject.asObservable();
  public selectedBill$ = this.selectedBillSubject.asObservable();
  public products$ = this.productsSubject.asObservable();

  // Product filtered by category and name
  filteredProducts$ = combineLatest([
    this.products$,
    this.selectedBill$,
    this.categoryFilterSubject,
    this.nameFilterSubject,
    this.bills$
  ]).pipe(
    map(([products, selectedBill, categoryFilter, nameFilter]) => {
      const regex = new RegExp(nameFilter, 'i');

      return products.map(product => {
        const productInBill = selectedBill?.items.find(item => item.productId === product.productId);

        const isInCategory = categoryFilter === 'todo' || product.categoryId === categoryFilter;
        const matchesName = regex.test(product.name);

        return {
          ...product,
          isSelected: !!productInBill, // Dependent on the selected bill
          quantity: productInBill ? productInBill.quantity : 1, // Dependent on the selected bill
          visible: isInCategory && matchesName // Dependent on the category and name filters
        };
      });
    })
  );

  constructor() { }

  public setProducts(products: ProductUI[]): void {
    this.productsSubject.next(products);
  }

  public setNewBill(bill: BillUI): void {
    const bills = this.billsSubject.value;
    bills.push(bill);
    this.billsSubject.next(bills);
    this.setSelectedBill(bill);
  }

  public setBills(bills: BillUI[]): void {
    this.billsSubject.next(bills);
  }

  public setSelectedBill(bill: BillUI | undefined): void {
    this.selectedBillSubject.next(bill);
  }

  public filterProductsByCategory(categoryId: string) {
    this.categoryFilterSubject.next(categoryId);
  }

  public filterProductsByName(name: string) {
    this.nameFilterSubject.next(name);
  }

  addProductToBill(product: ProductUI) {
    const currentBill = this.selectedBillSubject.value;
    if (!currentBill) return;

    // Update the quantity of the product if it already exists in the bill
    const existingProduct = currentBill.items.find(item => item.productId === product.productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
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

  public updateBill(bill: BillUI) {
    const bills = this.billsSubject.value;
    const index = bills.findIndex(b => b.billId === bill.billId);
    if (index >= 0) {
      bills[index] = bill;
      this.billsSubject.next([...bills]); // Update the bills list
      this.selectedBillSubject.next(bills[index]); // Update the selected bill
    }
  }
}
