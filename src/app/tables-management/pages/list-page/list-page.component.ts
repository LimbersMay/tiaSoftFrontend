import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {ErrorService} from "../../../shared/services/error.service";
import {Table} from "../../interfaces/table.interface";
import {TablesService} from "../../services/tables.service";
import {Area} from "../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../areas-management/services/areas.service";
import {TableStatus} from "../../enums/table-status.enum";
import {TableStatus as ITableStatus} from "../../interfaces/tableStatus.interface";
import {User} from "../../../auth/interfaces/user.interface";
import {UsersService} from "../../../users-management/services/users.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {
  public tables: Table[] = [];
  public areas: Area[] = [];
  public waiters: User[] = [];
  public tableStatuses: ITableStatus[] = [];

  public display: boolean = false;
  public displayRequestPaymentAuthorization: boolean = false;
  public displayWhereToPrintTicket!: boolean;

  public selectedTable: Table | undefined;

  // Events
  public onShowDialog = new Subject<Table | undefined>();

  // p-menu items
  public items: MenuItem[] | undefined;

  constructor(
    // Domain services
    private readonly tablesService: TablesService,
    private readonly areasService: AreasService,
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
  ) {
  }

  authorizePayment(table: Table) {
    // Map the list of tables and update the table that has been paid
    this.tables = this.tables.map(t => t.tableId === table.tableId ? table : t);

    this.messageService.add({ severity: 'success', summary: 'Pago autorizado', detail: 'El pago ha sido autorizado correctamente' });
  }

  public setSelectedTable(table: Table) {
    this.items = this.getMenuItems(table);
    this.selectedTable = table;
  }

  public getStatusColor(status: TableStatus) {
    switch (status) {
      case TableStatus.Activo:
        return 'info';
      case TableStatus.Pagado:
        return 'success';
      case TableStatus.PorAutorizar:
        return 'warning';
    }
  }

  // ------------- DIALOG METHODS -------------
  public showDialog(table?: Table): void {
    this.display = true;
    this.onShowDialog.next(table);
  }

  public closeDialog(event: boolean): void {
    this.display = event;
  }

  public showRequestPaymentAuthorizationDialog() {
    this.displayRequestPaymentAuthorization = true;
  }

  public closeRequestPaymentAuthorizationDialog(event: boolean) {
    this.displayRequestPaymentAuthorization = event;
  }

  public showWhereToPrintTicketDialog() {
    this.displayWhereToPrintTicket = true;
  }

  public closeWhereToPrintTicketDialog(event: boolean) {
    this.displayWhereToPrintTicket = event;
  }

  // ------------- CRUD METHODS -------------
  public sendTableToCashier(table: Table) {
    this.tablesService.sendTableToCashier(table.tableId).subscribe({
      next: _ => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cuenta generada',
          detail: 'Cuenta generada correctamente'
        });
      },
      error: error => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });
  }

  // Function to check if the table has been paid
  public isTablePaid(table: Table): boolean {
    return table && table.tableStatus.name === TableStatus.Pagado;
  }

// Function to check if the table is waiting for authorization
  public isTablePendingAuthorization(table: Table): boolean {
    return table && table.tableStatus.name === TableStatus.PorAutorizar;
  }


  public getMenuItems(table: Table): MenuItem[] {
    return [
      {
        label: 'Gestión de Mesa',
        items: [
          {
            label: 'Editar Mesa',
            icon: 'pi pi-pencil',
            // Disabled if table is either paid or pending authorization
            disabled: this.isTablePaid(table) || this.isTablePendingAuthorization(table),
            command: () => {
              this.showDialog(table);
            }
          },
          {
            label: 'Visualizar Mesa',
            icon: 'pi pi-eye',
          },
          {
            label: 'Cuentas',
            icon: 'pi pi-list',
            routerLink: `/tables/${table.tableId}/orders`
          }
        ]
      },
      {separator: true}, // Separador para dividir los grupos
      {
        label: 'Acciones de Cobro',
        items: [
          {
            label: 'Enviar a Caja',
            icon: 'pi pi-send',
            // Disabled if table is either paid or pending authorization
            disabled: this.isTablePaid(table) || this.isTablePendingAuthorization(table),
            command: () => {
              this.sendTableToCashier(table);
            }
          },
          {
            label: 'Autorizar Cobro',
            icon: 'pi pi-lock',
            // Disabled if table is paid, enabled if pending authorization
            disabled: this.isTablePaid(table),
            command: () => {
              this.showRequestPaymentAuthorizationDialog();
            }
          },
          {
            label: 'Imprimir Cuenta',
            icon: 'pi pi-print',
            command: () => {
              this.showWhereToPrintTicketDialog();
            }
          }
        ]
      }
    ];
  }


  public ngOnInit() {
    // ------------- GET TABLES -------------
    this.tablesService.getTables().subscribe({
      next: (tables: Table[]) => this.tables = tables,
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });

    // ------------- GET TABLE STATUSES -------------
    this.tablesService.getTableStatuses().subscribe({
      next: (tableStatuses: ITableStatus[]) => this.tableStatuses = tableStatuses,
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });

    // ------------- GET AREAS -------------
    this.areasService.getAreas().subscribe({
      next: (areas: Area[]) => this.areas = areas,
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });

    // ------------- GET USERS -------------
    this.usersService.getUsers().subscribe({
      next: (waiters: User[]) => this.waiters = waiters,
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });

    // ------------- ON RECEIVE TABLE -------------
    this.tablesService.onReceiveTable().subscribe({
      next: (table: Table) => {
        const index = this.tables.findIndex(t => t.tableId === table.tableId);

        if (index === -1) {
          this.tables = [...this.tables, table];
          return;
        }

        // Update table and refresh the whole list
        this.tables = this.tables.map(t => t.tableId === table.tableId ? table : t);
      },
      error: (error: any) => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    })
  }
}
