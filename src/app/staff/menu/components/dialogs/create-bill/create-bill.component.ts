import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ValidatorsService} from "../../../../../shared/services/validators.service";
import {FormBuilder} from "@angular/forms";
import {Bill} from "../../../../../tables-management/interfaces/bill.interface";
import {Observable, Subject, takeUntil} from "rxjs";
import {BillsService} from "../../../../../tables-management/services/bills.service";
import {BillDialogService} from "../../../services/bill-dialog.service";

@Component({
  selector: 'menu-create-bill',
  templateUrl: './create-bill.component.html',
  styles: ``
})
export class CreateBillComponent implements OnInit, OnDestroy {

  // Dialog properties
  public showCreateBillDialog!: boolean;
  @Input({ required: true }) public tableId!: string;

  private unsubscribe$: Subject<any> = new Subject<any>();

  public billForm = this.fb.nonNullable.group({
    billId: [''],
    name: [''],
    tableId: [this.tableId]
  });

  constructor(
    private readonly validatorsService: ValidatorsService,
    private readonly fb: FormBuilder,
    private readonly billsService: BillsService,
    private readonly billDialogService: BillDialogService
  ) {}

  public closeDialog() {
    this.billDialogService.showDialog(false);
    this.billForm.reset();
  }

  public get currentBill(): Bill {
    return this.billForm.value as Bill;
  }

  public onSubmit() {

    console.log(this.billForm.value);

    if (this.billForm.invalid) {
      this.billForm.markAllAsTouched();
      return;
    }

    if (!this.currentBill.billId) {
      this.billsService.createBill(this.currentBill).subscribe({
        next: (bill: Bill) => {
          this.billDialogService.showDialog(false);
          this.billDialogService.setOnCreatedBill(bill);
          this.billForm.reset();
        }
      });

      return;
    }

    this.billsService.updateBill(this.currentBill.billId, this.currentBill.name).subscribe({
      next: (bill: Bill) => {
        this.billDialogService.showDialog(false);
        this.billDialogService.setOnCreatedBill(bill);
        this.billForm.reset();
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
    this.billDialogService.showDialog$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((show: boolean) => {
      this.showCreateBillDialog = show;
    });

    this.billDialogService.dialogBill$
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((bill: Bill | undefined) => {
      if (!bill) {
        this.billForm.reset({
          tableId: this.tableId
        });
        return;
      }

      this.billForm.patchValue({
        billId: bill.billId,
        name: bill.name,
        tableId: bill.tableId
      });
    })
  }

  public ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }
}
