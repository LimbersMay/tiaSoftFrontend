import {Component, OnDestroy, OnInit} from '@angular/core';
import {ValidatorsService} from "../../../../../shared/services/validators.service";
import {FormBuilder} from "@angular/forms";
import {Bill, BillUI} from "../../../../../tables-management/interfaces/bill.interface";
import {BillsService} from "../../../../../tables-management/services/bills.service";
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'menu-create-bill',
  templateUrl: './create-bill.component.html',
  styles: ``
})
export class CreateBillComponent implements OnInit, OnDestroy {
  // Dialog properties
  public selectedBill?: BillUI;
  public instance: DynamicDialogComponent | undefined;

  public billForm = this.fb.nonNullable.group({
    billId: [''],
    name: [''],
    tableId: ['']
  });

  constructor(
    private readonly validatorsService: ValidatorsService,
    private readonly fb: FormBuilder,
    private readonly billsService: BillsService,
    public ref: DynamicDialogRef,
    private dialogService: DialogService
  ) {
    this.instance = this.dialogService.getInstance(this.ref);
  }

  public get currentBill(): Bill {
    return this.billForm.value as Bill;
  }

  public onSubmit() {

    if (this.billForm.invalid) {
      this.billForm.markAllAsTouched();
      return;
    }

    if (!this.currentBill.billId) {
      this.billsService.createBill(this.currentBill).subscribe({
        next: (bill: Bill) => {
          this.billForm.reset();
          this.ref.close(bill);
        }
      });

      return;
    }

    this.billsService.updateBill(this.currentBill.billId, this.currentBill.name).subscribe({
      next: (bill: Bill) => {
        this.billForm.reset();
        this.ref.close(bill);
      }
    });
  }

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.billForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.billForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.billForm, field);
  }

  public ngOnInit() {
    if (this.instance && this.instance.data) {

      // If the bill is new, we need the tableId
      const tableId = this.instance.data['tableId'];
      if (!tableId) {
        return;
      }

      this.billForm.patchValue({tableId});

      // If the bill is not new, we need the selectedBill
      const selectedBill = this.instance.data['selectedBill'];
      if (!selectedBill) {
        return;
      }

      // Retrieve the selected bill from the dialog data
      this.selectedBill = selectedBill;
      this.billForm.patchValue(selectedBill);
    }
  }

  close() {
    this.ref.close();
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
