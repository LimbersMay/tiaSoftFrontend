import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../../environments/environments";
import {catchError, map, Observable, throwError} from "rxjs";
import {Bill} from "../interfaces/bill.interface";
import {CreateBillDto} from "../interfaces/create-bill-dto.interface";

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  private readonly baseUrl = environments.baseURL;

  constructor(private readonly httpClient: HttpClient) {}

  public createBill(bill: CreateBillDto): Observable<Bill> {
    const url = `${this.baseUrl}/bills`;

    return this.httpClient.post<Bill>(url, bill, {withCredentials: true})
      .pipe(
        map(bill => bill),
        catchError(error => throwError(() => error))
      );
  }

  public updateBill(billId: string, billName: string): Observable<Bill> {
    const url = `${this.baseUrl}/bills/${billId}`;

    return this.httpClient.put<Bill>(url, { name: billName }, {withCredentials: true})
      .pipe(
        map(bill => bill),
        catchError(error => throwError(() => error))
      );
  }
}
