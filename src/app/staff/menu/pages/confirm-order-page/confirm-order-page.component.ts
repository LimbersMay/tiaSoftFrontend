import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {BillsStateService} from "../../services/billsState.service";
import {FormBuilder} from "@angular/forms";
import {skip, Subject, takeUntil} from "rxjs";
import {OrdersService} from "../../../orders/services/orders.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-confirm-order-page',
  templateUrl: './confirm-order-page.component.html',
  styleUrl: "confirm-order-page.component.scss",
  animations: []
})
export class ConfirmOrderPageComponent implements OnInit, OnDestroy {

  public productsToProcess: ProductUI[] = [];
  public bills: BillUI[] = [];
  public table: Table | undefined;
  public tableId!: string;

  // Unsubscribe from all subscriptions
  private unsubscribe$: Subject<any> = new Subject<any>();

  public billForm = this.fb.nonNullable.group({
    selectedBill: this.fb.nonNullable.control<BillUI | undefined>(undefined),
    additionalInfo: this.fb.control<string>(''),
    customerName: this.fb.control<string>(''),
  })

  constructor(
    private readonly tablesService: TablesService,
    private readonly billsState: BillsStateService,
    private readonly ordersService: OrdersService,

    private readonly messageService: MessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
  ) {}

  public get currentSelectedBill(): BillUI | undefined {
    return this.billForm.value.selectedBill;
  }

  public selectBill(selectedBill: BillUI) {
    this.billsState.setSelectedBill(selectedBill);
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
    if (!this.currentSelectedBill) return this.totalOfAllBills;

    return this.currentSelectedBill.items.reduce((acc: number, item: ProductUI) => acc + item.quantity * item.price, 0);
  }

  public increaseQuantity(product: ProductUI) {
    // If there is not a selected bill, select the first one
    if (!this.currentSelectedBill)
      this.billsState.setSelectedBill(this.bills[0]);

    this.billsState.addProductToBill(product);
  }

  public decreaseQuantity(product: ProductUI) {
    // If there is not a selected bill, select the first one
    if (!this.currentSelectedBill)
      this.billsState.setSelectedBill(this.bills[0]);

    this.billsState.removeProductFromBill(product);
  }

  public onSubmit() {
    // We only want to process bills that have items
    const billsToProcess = this.bills.filter(bill => bill.items.length > 0);

    this.ordersService.createOrder({
      bills: billsToProcess,
      additionalInfo: this.billForm.value.additionalInfo,
      customerName: this.billForm.value.customerName,
      areaId: this.table!.area.areaId
    }).subscribe({
      next: () => {
        localStorage.removeItem('bills');

        this.messageService.add({
          severity: 'success',
          summary: 'Orden creada',
          detail: 'La orden ha sido creada exitosamente'
        });

        this.router.navigate(['/staff/tables']);
      }
    })
  }

  public ngOnInit() {
    // Get all bills
    this.billsState.bills$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bills => this.bills = bills);

    this.billsState.products$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(products => this.productsToProcess = products);

    this.billsState.selectedBill$
      .pipe(
        takeUntil(this.unsubscribe$),
        skip(1) // Skip the first value
      )
      .subscribe(selectedBill => {
      this.billForm.patchValue({selectedBill});
      this.billsState.setProducts(selectedBill?.items || this.getAllProductsInBills());
    });

    const billsFromLocalStorage = localStorage.getItem('bills');

    if (billsFromLocalStorage) {
      const billsParsed: BillUI[] = JSON.parse(billsFromLocalStorage);
      this.billsState.setBills(billsParsed);
      this.billsState.setProducts(this.getAllProductsInBills());
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
    });

    // Subscribe onReceiveOrder
    this.ordersService.onReceiveOrders().subscribe({
      next: (order) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Orden recibida',
          detail: 'Se ha recibido una nueva orden'
        });
      }
    });
  }

  public ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();

    this.billsState.setBills([]);
    this.billsState.setSelectedBill(undefined);
    this.billsState.setProducts([]);
    this.billForm.reset();

    localStorage.removeItem('bills');
  }
}
