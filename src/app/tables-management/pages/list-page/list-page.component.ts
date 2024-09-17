import {Component, HostListener, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MenuItem, MessageService} from "primeng/api";
import {ErrorService} from "../../../shared/services/error.service";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {Table} from "../../interfaces/table.interface";
import {TablesService} from "../../services/tables.service";
import {Area} from "../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../areas-management/services/areas.service";
import {CreateTableDto} from "../../interfaces/create-table.dto";
import {TableStatus} from "../../enums/table-status.enum";
import { TableStatus as ITableStatus } from "../../interfaces/tableStatus.interface";
import {User} from "../../../auth/interfaces/user.interface";
import {UsersService} from "../../../users-management/services/users.service";
import {UpdateTableDto} from "../../interfaces/update-table.dto";
import {TableExistsValidatorService} from "../../validators/table-exists-validator.service";

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

  public display!: boolean;
  public displayRequestPaymentAuthorization!: boolean;
  public displayWhereToPrintTicket!: boolean;

  public selectedTable!: Table;

  // p-menu items
  public items: MenuItem[] | undefined;

  public tableForm = this.fb.nonNullable.group({
    // Hidden fields
    tableId: [''],
    userId: [''],

    // Visible fields
    name: ['', {updateOn: 'blur', validators:[Validators.required], asyncValidators: [this.tableValidator]}],
    customers: [0,[Validators.required, Validators.min(1)]],
    areaId: ['', Validators.required],
  });

  public authorizationForm = this.fb.nonNullable.group({
    tableId: [''],
    tableStatus: this.fb.nonNullable.group({
      tableStatusId: [''],
      name: [''],
      description: ['']
    }),
  });

  constructor(
    // Domain services
    private readonly tablesService: TablesService,
    private readonly areasService: AreasService,
    private readonly usersService: UsersService,

    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService,

    //Validators
    private readonly tableValidator: TableExistsValidatorService,
  ) {}

  // KEYBOARD EVENTS on press Key 'N'
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'n') {
      const index = this.tables.findIndex(t => t.tableId === this.authorizationForm.value.tableId);
      const newTable = structuredClone(this.tables[index]);

      if (index === -1) {
        this.showDialog();
        return;
      }

      newTable.tableStatus.name = TableStatus.Pagado;
      this.tables[index] = newTable;

      this.closeRequestPaymentAuthorizationDialog();
      this.messageService.add({severity: 'success', summary: 'Mesa pagada', detail: 'Mesa pagada correctamente'});
    }
  }

  public setSelectedTable (table: Table) {
    this.items = this.getMenuItems(table);
    this.selectedTable = table;
  }

  public get currentFormTable() {
    return this.tableForm.value;
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

    if (!table) {
      this.tableForm.reset();
      return;
    }

    this.tableForm.patchValue({
      tableId: table.tableId,
      name: table.name,
      customers: table.customers,
      areaId: table.area.areaId,
    });
  }

  public closeDialog(): void {
    this.display = false;
    this.tableForm.reset();
  }

  public showRequestPaymentAuthorizationDialog(table: Table) {
    this.displayRequestPaymentAuthorization = true;

    this.authorizationForm.patchValue({
      tableId: table.tableId,
      tableStatus: table.tableStatus
    });
  }

  public closeRequestPaymentAuthorizationDialog() {
    this.displayRequestPaymentAuthorization = false;
    this.tableForm.reset();
  }

  public showWhereToPrintTicketDialog() {
    this.displayWhereToPrintTicket = true;
  }

  public closeWhereToPrintTicketDialog() {
    this.displayWhereToPrintTicket = false;
  }

  // ------------- CRUD METHODS -------------
  public onSubmit() {

    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    if (!this.currentFormTable.tableId) {
      return this.tablesService.createTable(this.currentFormTable as CreateTableDto).subscribe({
        next: () => {
          this.closeDialog();
          this.messageService.add({severity: 'success', summary: 'Mesa creada', detail: 'Mesa creada correctamente'});
        },
        error: error => {
          const errorMessage = this.errorService.getErrorMessage(error);
          this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
        }
      });
    }

    // ------------- UPDATE TABLE -------------
    return this.tablesService.updateTable(this.currentFormTable as UpdateTableDto).subscribe({
      next: _ => {
        this.closeDialog();
        this.messageService.add({severity: 'success', summary: 'Mesa actualizada', detail: 'Mesa actualizada correctamente'});
      },
      error: error => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });
  }

  public sendTableToCashier(table: Table) {
    this.tablesService.sendTableToCashier(table.tableId).subscribe({
      next: _ => {
        this.messageService.add({severity: 'success', summary: 'Cuenta generada', detail: 'Cuenta generada correctamente'});
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
            // Visualizar mesa siempre está habilitada
          }
        ]
      },
      { separator: true }, // Separador para dividir los grupos
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
              this.showRequestPaymentAuthorizationDialog(table);
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

  // ------------- VALIDATORS METHODS -------------
  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.tableForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.tableForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.tableForm, field);
  }
}
