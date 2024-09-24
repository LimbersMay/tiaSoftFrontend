import {
  Component,
  EventEmitter,
  Input,
  OnDestroy, OnInit,
  Output,
} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, Validators} from "@angular/forms";
import {TableExistsValidatorService} from "../../../validators/table-exists-validator.service";
import {CreateTableDto} from "../../../interfaces/create-table.dto";
import {UpdateTableDto} from "../../../interfaces/update-table.dto";
import {Table} from "../../../interfaces/table.interface";
import {TablesService} from "../../../services/tables.service";
import {MessageService} from "primeng/api";
import {ErrorService} from "../../../../shared/services/error.service";
import {ValidatorsService} from "../../../../shared/services/validators.service";
import {Area} from "../../../../areas-management/interfaces/area.interface";
import {Observable} from "rxjs";

@Component({
  selector: 'tables-edit-table',
  templateUrl: './edit-table.component.html',
  styles: ``
})
export class EditTableComponent implements OnDestroy, OnInit {

  @Input({required: true}) display!: boolean;
  @Input({required: true}) areas!: Area[];
  @Input({required: true}) table: Table | undefined;
  @Input({required: true}) onShowDialog!: Observable<Table | undefined>;

  // When the value of the display property changes, the displayChange event is emitted
  @Output() displayChange = new EventEmitter<boolean>();

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
    customers: [0, [Validators.required, Validators.min(1)]],
    areaId: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly tableValidator: TableExistsValidatorService,
    private readonly tablesService: TablesService,
    private readonly messageService: MessageService,
    private readonly errorService: ErrorService,
    private readonly validatorsService: ValidatorsService
  ) {
  }

  public get currentFormTable() {
    return this.tableForm.value;
  }

  public onClose() {
    this.displayChange.emit(false);
    this.tableForm.reset();
  }

  public ngOnDestroy(): void {
    this.displayChange.unsubscribe();
  }

  public onSubmit() {

    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    if (!this.currentFormTable.tableId) {
      return this.tablesService.createTable(this.currentFormTable as CreateTableDto).subscribe({
        next: () => {
          this.onClose();
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
        this.onClose();
        this.messageService.add({
          severity: 'success',
          summary: 'Mesa actualizada',
          detail: 'Mesa actualizada correctamente'
        });
      },
      error: error => {
        const errorMessage = this.errorService.getErrorMessage(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      }
    });
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

  public ngOnInit() {
    this.onShowDialog.subscribe(value => {

      if (!value) {
        this.tableForm.reset();
        return;
      }

      this.tableForm.patchValue({
        tableId: value.tableId,
        userId: value.user.userId,
        name: value.name,
        customers: value.customers,
        areaId: value.area.areaId
      });
    })
  }
}
