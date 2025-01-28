import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {ProductsInOrderService} from "../../services/products-in-order.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CreateBillComponent} from "../dialogs/create-bill/create-bill.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'menu-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit {

  // Services
  public tablesService = inject(TablesService);
  private dialogService = inject(DialogService);

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public ref: DynamicDialogRef | undefined;

  // Store services
  private productsInOrderService = inject(ProductsInOrderService);

  public productsInOrder = this.productsInOrderService.productsInOrder.asReadonly();

  public bills = signal<BillUI[]>([]);

  // Incoming from the URL query param
  public selectedTable = signal<Table | null>(null);
  
  public selectedBill = signal<BillUI | null>(null);

  // Computed properties
  public totalOrder = computed(() => {
    return this.productsInOrder().reduce((acc, product) => acc + product.quantity * product.price, 0);
  });

  public totalInSelectedBill = computed(() => {

    if (!this.selectedBill()) {
      return this.totalOrder();
    }

    return this.selectedBill()?.total;
  });

  // ---------------------------- BILL DIALOG MANAGEMENT ----------------------------
  private openBillDialog(bill: BillUI | null) {
    this.ref = this.dialogService.open(CreateBillComponent, {
      header: 'Crear cuenta',
      data: {
        selectedBill: bill ? structuredClone(bill) : null,
        tableId: this.selectedTable()!.tableId
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      }
    });

    this.ref.onClose.subscribe((updatedBill: BillUI) => {
      if (!updatedBill) {
        return;
      }

      const billExists = this.bills().some(b => b.billId === updatedBill.billId);

      // If the bill does not exist, add it to the list
      if (!billExists) {
        this.bills.update(bills => [...bills, updatedBill]);
      }

      if (billExists) {
        this.bills.update(bills => bills.map(b => {
          if (b.billId === updatedBill.billId) {
            return updatedBill;
          }

          return b;
        }));
      }

      // Set the selected bill
      this.selectedBill.set(updatedBill);
    });
  }

  public openCreateBillDialog() {
    this.openBillDialog(null);
  }

  public openEditBillDialog() {
    this.openBillDialog(this.selectedBill());
  }

  public onSelectBill(bill: BillUI) {
    this.selectedBill.set(bill);
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const tableId = params['tableId'] as string;

      if (!tableId) {
        return this.router.navigate(['staff/tables/list']);
      }

      this.tablesService.getTableById(tableId).subscribe({
        next: table => {
          this.selectedTable.set(table);
          this.bills.set(table.bills.map(bill => ({...bill, items: []})));
        }
      })

      return;
    })
  }
}
