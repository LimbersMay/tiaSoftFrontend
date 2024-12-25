import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {BillUI} from "../../../../tables-management/interfaces/bill.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {ProductsInOrderService} from "../../services/products-in-order.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CreateBillComponent} from "../dialogs/create-bill/create-bill.component";
import {CreateTableComponent} from "../dialogs/create-table/create-table.component";

@Component({
  selector: 'menu-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit {
  // Services
  public tablesService = inject(TablesService);
  private dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  // Store services
  private productsInOrderService = inject(ProductsInOrderService);

  public productsInOrder = this.productsInOrderService.productsInOrder.asReadonly();

  public tables = signal<Table[]>([]);
  public bills = signal<BillUI[]>([]);

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

  // ---------------------------- TABLE DIALOG MANAGEMENT ---------------------------

  public openTableDialog(table: Table | null) {
    this.ref = this.dialogService.open(CreateTableComponent, {
      header: 'Crear mesa',
      data: {
        table: table ? structuredClone(table) : null,
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      }
    });

    // There's not a response from the dialog because it calls an asp.net hub
    // But we can subscribe to the tables service to get the updated table
    this.tablesService.onReceiveTable().subscribe((updatedTable: Table) => {

      const tableExists = this.tables().some(t => t.tableId === updatedTable.tableId);

      // If the table does not exist, add it to the list
      if (!tableExists) {
        this.tables.update(tables => [...tables, updatedTable]);
      }

      if (tableExists) {
        this.tables.update(tables => tables.map(t => {
          if (t.tableId === updatedTable.tableId) {
            return updatedTable;
          }

          return t;
        }));
      }

      // Set the selected table
      this.selectedTable.set(updatedTable);
    });
  }

  public openCreateTableDialog() {
    this.openTableDialog(null);
  }

  public openEditTableDialog() {
    this.openTableDialog(this.selectedTable());
  }

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

  public onSelectTable(table: Table) {
    if (table.tableId === 'new') {
      return;
    }

    this.bills.set(table.bills.map(bill => ({...bill, items: []})));

    this.selectedTable.set(table);
  }

  public onSelectBill(bill: BillUI) {
    this.selectedBill.set(bill);
  }

  public ngOnInit() {
    this.getTables();
  }

  private getTables() {
    this.tablesService.getTables().subscribe({
      next: tables => {

        // Set the tables
        this.tables.set(tables);

        // Set the bills
        this.bills.set(tables[0].bills.map(bill => ({...bill, items: []})),);
      }
    });
  }
}
