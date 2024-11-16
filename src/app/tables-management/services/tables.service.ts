import {Injectable} from '@angular/core';
import {environments} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {catchError, from, map, Observable, throwError} from "rxjs";
import {Table} from "../interfaces/table.interface";
import {CreateTableDto} from "../interfaces/create-table.dto";
import {TableStatus} from "../interfaces/tableStatus.interface";
import {UpdateTableDto} from "../interfaces/update-table.dto";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  private readonly baseUrl = environments.baseURL;
  private readonly connection: HubConnection;

  constructor(
    private readonly httpClient: HttpClient
  ) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/table`, {withCredentials: true})
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.start()
      .then(() => console.log('Connection started'))
      .catch((error) => console.log('Error while establishing connection: ' + error));
  }

  public getTableById(tableId: string): Observable<Table> {
    const url = `${this.baseUrl}/tables/${tableId}`;

    return this.httpClient.get<Table>(url, {withCredentials: true})
      .pipe(
        map(table => table),
        catchError(error => throwError(() => error))
      )
  }

  public getTables(): Observable<Table[]> {
    const url = `${this.baseUrl}/tables/all`;

    return this.httpClient.get<Table[]>(url, {withCredentials: true})
      .pipe(
        map(tables => tables),
        catchError(error => throwError(() => error))
      )
  }

  public getOnlyActiveAndNotPaidTables(): Observable<Table[]> {
    const url = `${this.baseUrl}/tables/activeAndNotPaid`;

    return this.httpClient.get<Table[]>(url, {withCredentials: true})
      .pipe(
        map(tables => tables),
        catchError(error => throwError(() => error))
      )
  }

  public createTable(table: CreateTableDto): Observable<void>{
    return from(this.connection.invoke('CreateTable', table));
  }

  public onReceiveTable(): Observable<Table> {
    return new Observable<Table>((observer) => {
      this.connection.on('ReceiveTable', (table: Table) => {
        observer.next(table);
      });
    })
  }

  public getTableStatuses(): Observable<TableStatus[]> {
    const url = `${this.baseUrl}/tables/statuses`;

    return this.httpClient.get<TableStatus[]>(url, {withCredentials: true})
      .pipe(
        map(tableStatuses => tableStatuses),
        catchError(error => throwError(() => error))
      )
  }

  public updateTable(table: UpdateTableDto): Observable<void> {
    return from(this.connection.invoke('UpdateTable', table.tableId, table));
  }

  // Send table to cashier to request authorization
  public sendTableToCashier(tableId: string): Observable<Table> {
    return from(this.connection.invoke('SendTableToCashier', tableId));
  }
}
