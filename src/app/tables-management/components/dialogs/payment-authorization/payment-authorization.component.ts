import {Component, EventEmitter, HostListener, Input, OnDestroy, Output} from '@angular/core';
import {Table} from "../../../interfaces/table.interface";
import {TableStatus} from "../../../enums/table-status.enum";

@Component({
  selector: 'tables-payment-authorization',
  templateUrl: './payment-authorization.component.html',
  styles: ``
})
export class PaymentAuthorizationComponent implements OnDestroy{
  @Input() display!: boolean;
  @Input({ required: true }) table: Table | undefined;

  @Output() displayChange = new EventEmitter<boolean>();

  // Events
  @Output() authorizePayment = new EventEmitter<Table>();

  // KEYBOARD EVENTS on press Key 'N'
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'n') {

      if (!this.table) {
        return;
      }

      this.authorizePayment.emit({
        ...this.table,
        tableStatus: {
          ...this.table.tableStatus,
          name: TableStatus.Pagado
        }
      });

      this.onClose();
    }
  }

  public onClose() {
    this.displayChange.emit(false);
  }

  public ngOnDestroy(): void {
    this.displayChange.unsubscribe();
  }
}
