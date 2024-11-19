import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesService} from "../../../../categories-management/services/categories.service";
import {Category} from "../../../../categories-management/interfaces/category.interface";
import {Product} from "../../../../products-management/interfaces/product.interface";
import {ProductsService} from "../../../../products-management/services/products.service";
import {ProductUI} from "../../interfaces/product-ui.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {Bill, BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {Subject, takeUntil, tap} from "rxjs";
import {MessageService} from "primeng/api";
import {FormBuilder} from "@angular/forms";
import {BillsStateService} from "../../services/billsState.service";
import {BillDialogService} from "../../services/bill-dialog.service";


export interface Order {
  totalProducts: number;
  totalPrice: number;
}

@Component({
  selector: 'app-list-page-component',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css'],
})
export class ListPageComponent implements OnInit, OnDestroy {

  public category: string = '';
  public categories: Category[] = [];

  // Bill management
  public products: ProductUI[] = [];
  public bills: BillUI[] = [];

  public tableId!: string;

  private unsubscribe$: Subject<any> = new Subject<any>();

  public billForm = this.fb.nonNullable.group({
    selectedBill: this.fb.nonNullable.control<BillUI | undefined>(undefined),
  })

  constructor(
    private readonly tablesService: TablesService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,

    private readonly billsStore: BillsStateService,
    private readonly billDialogService: BillDialogService,

    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,

    private readonly fb: FormBuilder
  ) {}

  public get currentOrderInfo(): Order {
    // Get the total products from the bills
    // Count the total products based on the items.products array, each product has a quantity property
    const totalProducts = this.bills
      .map(bill => bill.items)
      .flat()
      .reduce((acc: number, item: ProductUI) => acc + item.quantity, 0);

    // Get the total price from the bills
    const totalPrice = this.bills.reduce((acc: number, bill: BillUI) => acc + bill.total, 0);

    return {
      totalProducts,
      totalPrice,
    };
  }

  public selectBill(selectedBill: BillUI) {
    this.billsStore.setSelectedBill(selectedBill);
  }

  public showEditBill() {
    if (!this.billForm.value.selectedBill) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Por favor, selecciona una cuenta a editar.'});
      return;
    }

    this.billDialogService.showDialog(true);
    this.billDialogService.setDialogBill(this.billForm.value.selectedBill);
  }

  public showCreateBill() {
    this.billDialogService.showDialog(true);
    this.billDialogService.setDialogBill(undefined);
  }

  public newBillCreated(bill: Bill) {

    // If the bill index exists, the index will be greater than 0
    const billIndex = this.bills.findIndex((b: BillUI) => b.billId === bill.billId);
    if (billIndex >= 0) {
      this.billsStore.updateBill({
        ...bill,
        items: this.bills[billIndex].items
      });
      return;
    }

    // If the bill doesn't exist, create it
    this.billsStore.setNewBill({
      ...bill,
      items: []
    });
  }

  public processOrder() {
    localStorage.setItem('bills', JSON.stringify(this.bills));
    this.router.navigate(['/staff/menu/process-order'], {queryParams: {tableId: this.tableId}});
  }

  public filterProducts(categoryId: string) {
    this.billsStore.filterProductsByCategory(categoryId);
  }

  public filterProductsByName(name: string) {
    this.billsStore.filterProductsByName(name);
  }

  // Card methods
  public selectProduct(product: ProductUI) {
    if (product.isSelected) return;

    this.billsStore.addProductToBill(product);
  }

  public increaseQuantity(product: ProductUI) {
    this.billsStore.addProductToBill(product);
  }

  public decreaseQuantity(product: ProductUI) {
    this.billsStore.removeProductFromBill(product);
  }

  public getActiveClass(category?: string) {
    const activeClass = "border-primary-500 bg-primary-50 border-2 text-primary";

    if (category === this.category) {
      return activeClass;
    }

    if (!this.category && category == 'todo') {
      return activeClass;
    }

    return "border-300 bg-white text-600";
  }

  public ngOnInit(): void {

    // Subscribe to the bills store
    this.billsStore.bills$
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe when the component is destroyed
      .subscribe(bills => this.bills = bills);

    this.billsStore.selectedBill$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(selectedBill => this.billForm.patchValue({selectedBill}));

    this.billsStore.filteredProducts$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(products => this.products = products);

    // When create a new bill in the dialog
    this.billDialogService.onCreatedBill$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(bill => this.newBillCreated(bill));

    // Get categories
    this.categoriesService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    // Get products
    this.productsService.getProducts().subscribe(products => {
      const mappedProducts = products.map((product: Product) => ({
        ...product,
        isSelected: false,
        quantity: 1,
        visible: true,
      }));

      this.billsStore.setProducts(mappedProducts);
    });

    // Get current table
    this.activatedRoute.queryParams
      .subscribe(params => {
      this.category = params['categoryId'];

      const tableId = params['tableId'];

      if (!tableId) {
        this.router.navigate(['/staff/tables']);
        return;
      }

      if (tableId === this.tableId) return;

      this.tableId = tableId;

      this.tablesService.getTableById(tableId).subscribe(table => {
        const billsMapped = table.bills.map((bill: Bill) => ({
          ...bill,
          items: []
        }));

        this.billsStore.setBills(billsMapped);
        this.billsStore.setSelectedBill(billsMapped[0]);
      });
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }
}
