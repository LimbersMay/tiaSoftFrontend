import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Bill} from "../../../tables-management/interfaces/bill.interface";

@Injectable({
  providedIn: 'root'
})
export class BillDialogService {

  // Subjects to store the state of the dialog
  private showDialogSubject = new BehaviorSubject<boolean>(false);
  private dialogBillSubject = new BehaviorSubject<Bill | undefined>(undefined);
  private onCreatedBillSubject = new BehaviorSubject<Bill>({} as Bill);

  // Observables to expose the state of the dialog
  public showDialog$ = this.showDialogSubject.asObservable();
  public dialogBill$ = this.dialogBillSubject.asObservable();
  public onCreatedBill$ = this.onCreatedBillSubject.asObservable();

  constructor() { }

  public showDialog(show: boolean): void {
    this.showDialogSubject.next(show);
  }

  public setDialogBill(bill: Bill | undefined): void {
    this.dialogBillSubject.next(bill);
  }

  public setOnCreatedBill(bill: Bill): void {
    this.onCreatedBillSubject.next(bill);
  }
}
