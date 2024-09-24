import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';

@Component({
  selector: 'tables-print-bill',
  templateUrl: './print-bill.component.html',
  styles: ``
})
export class PrintBillComponent implements OnDestroy{
  @Input() display!: boolean;
  @Output() displayChange = new EventEmitter<boolean>();

  public onClose() {
    this.displayChange.emit(false);
  }

  public ngOnDestroy(): void {
    this.displayChange.unsubscribe();
  }
}
