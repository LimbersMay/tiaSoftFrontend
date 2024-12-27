import {Component, inject, output} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'tables-print-bill',
  templateUrl: './print-bill.component.html',
  styles: ``
})
export class PrintBillComponent {

  public onSelectThermalPrinter = output();

  // Services
  private dialogService = inject(DialogService);

  public instance: DynamicDialogComponent | undefined;

  constructor(public ref: DynamicDialogRef) {
    this.instance = this.dialogService.getInstance(this.ref);
  }
}
