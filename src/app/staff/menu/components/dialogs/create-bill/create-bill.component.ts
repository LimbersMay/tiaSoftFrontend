import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ValidatorsService} from "../../../../../shared/services/validators.service";
import {FormBuilder} from "@angular/forms";
import {Bill} from "../../../../../tables-management/interfaces/bill.interface";
import {Observable} from "rxjs";
import {BillsService} from "../../../../../tables-management/services/bills.service";

@Component({
  selector: 'menu-create-bill',
  templateUrl: './create-bill.component.html',
  styles: ``
})
export class CreateBillComponent implements OnInit, OnDestroy {

  // Dialog properties
  @Input({ required: true }) public showCreateBillDialog!: boolean;
  @Input({ required: true }) public tableId!: string;

  // When the value of the display property changes, the displayChange event is emitted
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() public onCreateBill = new EventEmitter<Bill>();

  @Input({required: true}) public onShowDialog!: Observable<Bill | undefined>;

  public billForm = this.fb.nonNullable.group({
    billId: [''],
    name: [''],
    tableId: [this.tableId]
  });

  constructor(
    private readonly validatorsService: ValidatorsService,
    private readonly fb: FormBuilder,
    private readonly billsService: BillsService
  ) {}

  public closeDialog() {
    this.displayChange.emit(false);
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
          this.displayChange.emit(false);
          this.onCreateBill.emit(bill);
          this.billForm.reset();
        }
      });

      return;
    }

    this.billsService.updateBill(this.currentBill.billId, this.currentBill.name).subscribe({
      next: (bill: Bill) => {
        this.displayChange.emit(false);
        this.onCreateBill.emit(bill);
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
    this.onShowDialog.subscribe((bill: Bill | undefined) => {
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
    this.displayChange.unsubscribe();
  }
}
