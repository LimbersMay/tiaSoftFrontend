import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {ErrorService} from "../../../shared/services/error.service";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {Table} from "../../interfaces/table.interface";
import {TablesService} from "../../services/tables.service";
import {Area} from "../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../areas-management/services/areas.service";
import {AuthService} from "../../../auth/services/auth.service";
import {CreateTableDto} from "../../interfaces/create-table.dto";
import {TableStatus} from "../../enums/table-status.enum";
import { TableStatus as ITableStatus } from "../../interfaces/tableStatus.interface";
import {User} from "../../../auth/interfaces/user.interface";
import {UsersService} from "../../../users-management/services/users.service";
import {UpdateTableDto} from "../../interfaces/update-table.dto";

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

  public tableForm = this.fb.group({
    // Hidden fields
    tableId: [''],
    userId: [''],

    // Visible fields
    name: ['', Validators.required],
    customers: [0],
    areaId: [''],
  })

  constructor(
    // Domain services
    private readonly tablesService: TablesService,
    private readonly areasService: AreasService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,

    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
    private readonly fb: FormBuilder,
    private readonly validatorsService: ValidatorsService
  ) {}

  public get currentTable() {
    return this.tableForm.value;
  }

  public getStatusColor(status: TableStatus) {
    switch (status) {
      case TableStatus.Activo:
        return 'info';
      case TableStatus.Pagado:
        return 'success';
    }
  }

  // ------------- DIALOG METHODS -------------

  public showDialog(table?: Table) {
    this.display = true;
    this.tableForm.reset(table);

    if (this.authService.currentUser?.userId)
      this.tableForm.get('userId')?.setValue(this.authService.currentUser?.userId);

    if (table?.area)
      this.tableForm.get('areaId')?.setValue(table?.area.areaId);
  }

  public closeDialog(): void {
    this.display = false;
    this.tableForm.reset();
  }

  // ------------- CRUD METHODS -------------
  public onSubmit() {

    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    if (!this.currentTable.tableId) {
      return this.tablesService.createTable(this.currentTable as CreateTableDto).subscribe({
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
    return this.tablesService.updateTable(this.currentTable as UpdateTableDto).subscribe({
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
          this.tables.push(table);
          return;
        }

        this.tables[index] = table;
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
