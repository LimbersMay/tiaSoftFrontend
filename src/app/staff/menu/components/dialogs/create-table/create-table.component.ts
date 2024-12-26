import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ValidatorsService} from "../../../../../shared/services/validators.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {TableExistsValidatorService} from "../../../../../tables-management/validators/table-exists-validator.service";
import {Table} from "../../../../../tables-management/interfaces/table.interface";
import {Area} from "../../../../../areas-management/interfaces/area.interface";
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from "primeng/dynamicdialog";
import {AreasService} from "../../../../../areas-management/services/areas.service";
import {CreateTableDto} from "../../../../../tables-management/interfaces/create-table.dto";
import {UpdateTableDto} from "../../../../../tables-management/interfaces/update-table.dto";
import {TablesService} from "../../../../../tables-management/services/tables.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrl: './create-table.component.scss'
})
export class CreateTableComponent implements OnInit, OnDestroy {

  // Validators
  private validatorsService = inject(ValidatorsService);
  private tableValidator = inject(TableExistsValidatorService);
  private fb = inject(FormBuilder);

  // Services
  private areasService = inject(AreasService);
  private tablesService = inject(TablesService);
  private messageService = inject(MessageService);

  // Dialog management
  private dialogService = inject(DialogService);
  public instance: DynamicDialogComponent | undefined;

  public table: Table | undefined;
  public areas: Area[] = [];

  constructor( public ref: DynamicDialogRef) {
    this.instance = this.dialogService.getInstance(this.ref);
  }

  public tableForm = this.fb.nonNullable.group({
    // Hidden fields
    tableId: [''],
    userId: [''],

    // Visible fields
    name: ['', {
      updateOn: 'blur',
      validators: [Validators.required],
      asyncValidators: [(control: AbstractControl) => this.tableValidator.validate(control, this.table?.name)]
    }],
    areaId: ['', Validators.required],
  });

  public get currentFormTable() {
    return this.tableForm.value;
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.tableForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.tableForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.tableForm, field);
  }

  public onSubmit() {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    if (!this.currentFormTable.tableId) {
      return this.tablesService.createTable(this.currentFormTable as CreateTableDto).subscribe({
        next: () => {
          this.ref.close();
          this.messageService.add({severity: 'success', summary: 'Mesa creada', detail: 'Mesa creada correctamente'});
        },
      });
    }

    // ------------- UPDATE TABLE -------------
    return this.tablesService.updateTable(this.currentFormTable as UpdateTableDto).subscribe({
      next: _ => {
        this.onClose();
        this.messageService.add({
          severity: 'success',
          summary: 'Mesa actualizada',
          detail: 'Mesa actualizada correctamente'
        });
      },
    });
  }

  public onClose() {
    this.ref.close();
  }

  public ngOnInit() {
    this.getAreas();

    if (this.instance && this.instance.data) {
      const table = this.instance.data['table'] as Table;
      const areaId = this.instance.data['areaId'] as string;

      if (!table) {
        this.tableForm.patchValue({ areaId });
        return;
      }

      this.table = table;
      this.tableForm.patchValue(table);
      this.tableForm.patchValue({areaId: table.area.areaId});
    }
  }

  private getAreas() {
    this.areasService.getAreas().subscribe({
      next: (areas: Area[]) => {
        this.areas = areas;
      }
    })
  }

  public ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
