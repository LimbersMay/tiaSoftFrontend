import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {DropdownChangeEvent} from "primeng/dropdown";

@Component({
  selector: 'app-confirm-order-page',
  templateUrl: './confirm-order-page.component.html',
  styleUrl: "confirm-order-page.component.css",
  animations: []
})
export class ConfirmOrderPageComponent implements OnInit, OnDestroy {

  public productsToProcess: ProductUI[] = [];
  public bills: BillUI[] = [];
  public table: Table | undefined;
  public tableId!: string;

  public selectedBill?: BillUI = undefined;

  constructor(
    private readonly tablesService: TablesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  public selectBill(selectedBillId: DropdownChangeEvent) {
    console.log(this.bills);

    this.selectedBill = this.bills.find((bill: BillUI) => bill.billId === selectedBillId.value);

    // Change the products with the products of the selected bill
    // Products array have products and the current bill has his own products
    // Change the products array with the products of the selected bill
    // Loop through the products of the selected bill and change the product with the same id in the products array
    if (!this.selectedBill) {
      this.productsToProcess = this.getAllProductsInBills();
      return;
    }

    this.productsToProcess = this.productsToProcess.map((product: ProductUI) => {
      const productInBill = this.selectedBill?.items.find((item: ProductUI) => item.productId === product.productId);

      if (productInBill) {
        return {
          ...product,
          isSelected: true,
          quantity: productInBill.quantity
        };
      }

      return {
        ...product,
        isSelected: false,
        quantity: 1
      };
    });
  }

  public getAllProductsInBills(): ProductUI[] {
    return this.bills
      .flatMap(bill => bill.items.map(item => ({...item}))) // Flatten the array of items
      .reduce((acc: ProductUI[], item: ProductUI) => {
        const existingProduct = acc.find(product => product.productId === item.productId);

        if (existingProduct) {
          // If the product already exists, add the quantity
          existingProduct.quantity += item.quantity;
        } else {
          // If the product doesn't exist, add it to the
          acc.push({...item});
        }

        return acc;
      }, []);
  }

  public get totalOfAllBills(): number {
    return this.bills.reduce((acc: number, bill: BillUI) => acc + bill.total, 0);
  }

  public get currentBillTotal(): number {
    if (!this.selectedBill) return this.totalOfAllBills;

    return this.selectedBill.items.reduce((acc: number, item: ProductUI) => acc + item.quantity * item.price, 0);
  }

  public ngOnInit() {
    const billsFromLocalStorage = localStorage.getItem('bills');

    if (billsFromLocalStorage) {
      this.bills = JSON.parse(billsFromLocalStorage);
      this.productsToProcess = this.getAllProductsInBills();
    }

    // Get current table
    this.activatedRoute.queryParams.subscribe(params => {
      const tableId = params['tableId'];

      if (!tableId) {
        //this.router.navigate(['/staff/tables']);
        return;
      }

      if (tableId === this.tableId) return;

      this.tableId = tableId;

      this.tablesService.getTableById(tableId).subscribe({
        next: table => {
          this.table = table;
        },
      })
    })
  }

  public ngOnDestroy() {
    console.log('destroy');
    //localStorage.removeItem('order');
  }
}
