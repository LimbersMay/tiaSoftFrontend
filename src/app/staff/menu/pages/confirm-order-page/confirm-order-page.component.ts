import {Component, OnInit} from '@angular/core';
import {ProductUI} from "../../interfaces/product-ui.interface";
import {Table} from "../../../../tables-management/interfaces/table.interface";
import {TablesService} from "../../../../tables-management/services/tables.service";

@Component({
  selector: 'app-confirm-order-page',
  templateUrl: './confirm-order-page.component.html',
  styles: ``,
  animations: []
})
export class ConfirmOrderPageComponent implements OnInit{

  public productsToProcess: ProductUI[] = [];
  public tables: Table[] = [];

  constructor(
    private readonly tablesService: TablesService,
  ) {}

  public ngOnInit() {
    this.productsToProcess = JSON.parse(localStorage.getItem('order') || '[]');

    this.tablesService.getTables().subscribe((tables: Table[]) => {
      this.tables = tables;
    });
  }
}
