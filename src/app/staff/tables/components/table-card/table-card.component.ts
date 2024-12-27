import {Component, input, output} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TableStatus} from "../../../../tables-management/enums/table-status.enum";

@Component({
  selector: 'tables-table-card',
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.scss'
})
export class TableCardComponent {

  public table = input.required<Table>();
  public isSelected = input.required<boolean>();

  public onSelectTable = output<Table>();

  public getTableStatusClass(): string {
    switch (this.table().tableStatus.name) {
      case TableStatus.PorAutorizar:
        return 'bg-orange-500';
      case TableStatus.Pagado:
        return 'bg-green-500';
      default:
        return 'bg-primary-500';
    }
  }

  public getTableSelectedClass(): string {
    switch (this.table().tableStatus.name) {
      case TableStatus.PorAutorizar:
        return 'bg-orange-400';
      case TableStatus.Pagado:
        return 'bg-green-400';
      default:
        return 'bg-primary-400';
    }
  }

  public selectTable(): void {
    this.onSelectTable.emit(this.table());
  }
}
