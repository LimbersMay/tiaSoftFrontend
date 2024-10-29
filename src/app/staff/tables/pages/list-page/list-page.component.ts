import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {MenuItem, MessageService} from "primeng/api";
import {TableStatus} from "../../../../tables-management/enums/table-status.enum";
import {ContextMenu} from "primeng/contextmenu";
import {Subject} from "rxjs";
import {Area} from "../../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../../areas-management/services/areas.service";
import {ErrorService} from "../../../../shared/services/error.service";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: 'list-page.component.css'
})
export class ListPageComponent implements OnInit{

  @ViewChild('cm') public cm!: ContextMenu;

  // Modal properties
  public showEditTable: boolean = false;
  public showWhereToPrintTicket: boolean = false;
  public areas: Area[] = [];

  // Modal events
  public onShowDialog = new Subject<Table | undefined>();

  public tables: Table[] = [];
  public selectedTable: Table | undefined;
  public contextMenuItems!: MenuItem[];

  constructor(
    private readonly tablesService: TablesService,
    private readonly areasService: AreasService,
    private readonly errorService: ErrorService,
    private readonly messageService: MessageService
  ) {}

  // -------------------------- TABLE METHODS --------------------------
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

  public getTableStatusClass(table: Table): string {
    switch (table.tableStatus.name) {
      case TableStatus.PorAutorizar:
        return 'bg-orange-500';
      default:
        return 'bg-primary-500';
    }
  }

  // Dialog to edit a table methods
  public showEditTableDialog(table?: Table) {
    this.showEditTable = true;
    this.onShowDialog.next(table);
  }

  public closeEditTableDialog() {
    this.showEditTable = false;
  }

  public showWhereToPrintTicketDialog() {
    this.showWhereToPrintTicket = true;
  }

  public closeWhereToPrintTicketDialog($event: boolean) {
    this.showWhereToPrintTicket = $event;
  }

  // Function to check if the table has been paid
  public isTablePaid(table: Table): boolean {
    return table && table.tableStatus.name === TableStatus.Pagado;
  }

  // Function to check if the table is waiting for authorization
  public isTablePendingAuthorization(table: Table): boolean {
    return table && table.tableStatus.name === TableStatus.PorAutorizar;
  }

  public onContextMenu(event: MouseEvent, table: Table) {
    this.selectedTable = table;
    this.contextMenuItems = this.getMenuItems(table);
    this.cm.show(event);
  }

  public getMenuItems(table: Table): MenuItem[] {
    return [
      {
        label: 'Editar mesa',
        icon: 'pi pi-pencil',
        disabled: this.isTablePaid(table) || this.isTablePendingAuthorization(table),
        command: () => {
          this.showEditTableDialog(table);
        }
      },
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
        label: 'Imprimir Cuenta',
        icon: 'pi pi-print',
        command: () => {
          this.showWhereToPrintTicketDialog();
        }
      }
    ];
  }

  public ngOnInit() {
    this.tablesService.getOnlyActiveAndNotPaidTables()
      .subscribe({
        next: (tables: Table[]) => {
          this.tables = tables;
        },
        error: (error) => {
          console.error(error);
        }
      });

    this.areasService.getAreas()
      .subscribe({
        next: (areas: Area[]) => {
          this.areas = areas;
        },
        error: (error) => {
          console.error(error);
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
