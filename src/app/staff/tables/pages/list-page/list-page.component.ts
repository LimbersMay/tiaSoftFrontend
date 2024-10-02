import {Component, OnInit} from '@angular/core';
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: 'list-page.component.css'
})
export class ListPageComponent implements OnInit{

  public tables: Table[] = [];

  public items: MenuItem[] = [
    {label: 'Edit', icon: 'pi pi-pencil'},
    {label: 'Delete', icon: 'pi pi-trash'}
  ];

  constructor(private readonly tablesService: TablesService) {}

  public ngOnInit() {
    this.tablesService.getTables()
      .subscribe({
        next: (tables: Table[]) => {
          this.tables = tables;
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}
