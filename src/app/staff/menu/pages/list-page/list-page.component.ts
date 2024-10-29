import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesService} from "../../../../categories-management/services/categories.service";
import {Category} from "../../../../categories-management/interfaces/category.interface";
import {Product} from "../../../../products-management/interfaces/product.interface";
import {ProductsService} from "../../../../products-management/services/products.service";
import {ProductUI} from "../../interfaces/product-ui.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {Bill, BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {Subject} from "rxjs";
import {MessageService} from "primeng/api";
import {FormBuilder} from "@angular/forms";


export interface Order {
  totalProducts: number;
  totalPrice: number;
}

@Component({
  selector: 'app-list-page-component',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css'],
})
export class ListPageComponent implements OnInit {

  public category: string = '';
  public categories: Category[] = [];
  public products: ProductUI[] = [];
  public bills: BillUI[] = [];

  public tableId!: string;

  // Dialog properties
  public selectedBill?: BillUI;
  public showCreateBillDialog!: boolean;

  public billForm = this.fb.nonNullable.group({
    selectedBill: this.fb.nonNullable.control<BillUI | undefined>(undefined),
  })

  // Events
  public onShowDialog = new Subject<BillUI | undefined>();

  constructor(
    private readonly tablesService: TablesService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,

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
    // Find the current bill in the bills array and replace it with the selectedBill
    const index = this.bills.findIndex((bill: BillUI) => bill.billId === this.billForm.value.selectedBill?.billId);
    this.bills[index] = this.billForm.value.selectedBill as BillUI;

    this.selectedBill = selectedBill;

    this.products = this.products.map((product: ProductUI) => {
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

  public showEditBill() {
    if (!this.selectedBill) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Por favor, selecciona una cuenta a editar.'});
      return;
    }

    this.showCreateBillDialog = true;
    this.onShowDialog.next(this.selectedBill);
  }

  public showCreateBill() {
    this.showCreateBillDialog = true;
    this.onShowDialog.next(undefined);
  }

  public newBillCreated(bill: Bill) {
    // If the bill already exists, update it
    if (this.bills.find((b: BillUI) => b.billId === bill.billId)) {
      const index = this.bills.findIndex((b: BillUI) => b.billId === bill.billId);
      this.bills[index] = { ...bill, items: [] };

      return;
    }

    // If the bill doesn't exist, create it
    this.bills = [...this.bills, { ...bill, items: [] }];
    this.selectedBill = { ...bill, items: [] };
  }

  public closeBillDialog($event: boolean) {
    this.showCreateBillDialog = $event;
  }

  public processOrder() {
    console.log(this.bills);
    localStorage.setItem('bills', JSON.stringify(this.bills));
    this.router.navigate(['/staff/menu/process-order'], {queryParams: {tableId: this.tableId}});
  }

  public filterProducts(categoryId: string) {
    if (categoryId === 'todo') {
      this.products.forEach((product: ProductUI) => {
        product.visible = true;
      });
      return;
    }

    this.products.forEach((product: ProductUI) => {
      product.visible = product.categoryId === categoryId;
    });
  }

  public filterProductsByName(name: string) {
    this.products.forEach((product: ProductUI) => {
      // Filter with regex
      const regex = new RegExp(name, 'i');
      product.visible = regex.test(product.name);
    });
  }

  // Card methods
  public selectProduct(product: ProductUI) {
    if (!product.isSelected) {
      if (this.billForm.value.selectedBill) {

        console.log("Adding product to bill");

        const selectedBill = this.billForm.get('selectedBill')?.value as BillUI;
        selectedBill.items.push({ ...product });
        selectedBill.total += product.price;

        this.billForm.setValue({selectedBill});
      }
    }

    product.isSelected = true;
  }

  public increaseQuantity(product: ProductUI) {
    product.quantity += 1;

    if (!this.billForm.value.selectedBill) return;

    const mappedItems = this.billForm.value.selectedBill.items.map((item: ProductUI) => {
      if (item.productId === product.productId) {
        item.quantity += 1;
      }

      return item;
    });

    const selectedBill = this.billForm.get('selectedBill')?.value as BillUI;

    selectedBill.items = mappedItems;
    selectedBill.total += product.price;

    this.billForm.setValue({selectedBill});
  }

  public decreaseQuantity(product: ProductUI) {
    if (product.quantity > 0) {
      product.quantity -= 1;

      if (!this.selectedBill) return;

      this.selectedBill.items.forEach((item: ProductUI) => {
        if (item.productId === product.productId) {
          item.quantity -= 1;
        }
      });

      this.selectedBill.total -= product.price;
    }

    if (product.quantity <= 0) {
      product.isSelected = false;
      product.quantity = 1;

      if (this.selectedBill)
        this.selectedBill.items = this.selectedBill?.items.filter((item: ProductUI) => item.productId !== product.productId);
    }
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

    this.categoriesService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.productsService.getProducts().subscribe(products => {
      this.products = products.map((product: Product) => ({
        ...product,
        isSelected: false,
        quantity: 1,
        visible: true,
      }));
    });

    // Get current table
    this.activatedRoute.queryParams.subscribe(params => {
      this.category = params['categoryId'];

      const tableId = params['tableId'];

      if (!tableId) {
        this.router.navigate(['/staff/tables']);
        return;
      }

      if (tableId === this.tableId) return;

      this.tableId = tableId;

      this.tablesService.getTableById(tableId).subscribe(table => {
        this.bills = table.bills.map((bill: Bill) => ({
          ...bill,
          items: []
        }));

        this.billForm.setValue({selectedBill: this.bills[0]});
      });
    });
  }
}
