import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {ContextMenu} from "primeng/contextmenu";
import {Area} from "../../../../areas-management/interfaces/area.interface";
import {AreasService} from "../../../../areas-management/services/areas.service";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CreateTableComponent} from "../../../menu/components/dialogs/create-table/create-table.component";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: 'list-page.component.scss'
})
export class ListPageComponent implements OnInit{

  // Services
  private tablesService = inject(TablesService);
  private areasService = inject(AreasService);
  private dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  @ViewChild('cm') public cm!: ContextMenu;

  public areas: Area[] = [];

  public tables: Table[] = [];
  public selectedTable = signal<Table | null>(null);

  constructor() {
  }

  // ---------------------------- TABLE DIALOG MANAGEMENT ---------------------------
  public openTableDialog(table: Table | null, areaId: string) {
    this.ref = this.dialogService.open(CreateTableComponent, {
      header: 'Crear mesa',
      data: {
        table: table ? structuredClone(table) : null,
        areaId
      },
      styleClass: 'p-fluid',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '80%'
      }
    });
  }

  public selectTable(table: Table) {
    this.selectedTable.set(table);
  }

  public getTablesByArea(areaId: string): Table[] {
    return this.tables.filter(t => t.area.areaId === areaId);
  }

  public ngOnInit() {
    this.tablesService.getOnlyActiveAndNotPaidTables()
      .subscribe({
        next: (tables: Table[]) => {
          this.tables = tables;
        }
      });

    this.areasService.getAreas()
      .subscribe({
        next: (areas: Area[]) => {
          this.areas = areas;
        }
      });

    // ------------- ON RECEIVE TABLE -------------
    this.tablesService.onReceiveTable().subscribe({
      next: (table: Table) => {

        const index = this.tables.findIndex(t => t.tableId === table.tableId);

        if (index === -1) {
          this.tables = [...this.tables, table];
          return;
        }

        // Update table and refresh the whole list
        this.tables = this.tables.map(t => t.tableId === table.tableId ? table : t);
      }
    })
  }
}
