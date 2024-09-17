import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {environments} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Table} from "../interfaces/table.interface";

@Injectable({
  providedIn: 'root'
})
export class TableExistsValidatorService implements AsyncValidator{

  private readonly baseUrl = environments.baseURL;

  constructor(private readonly http: HttpClient) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const tableName = control.value;
    const url = `${this.baseUrl}/tables/tableExists?tableName=${tableName}`;

    return this.http.get<Table>(url, {withCredentials: true})
      .pipe(
        map(resp => (resp) ? { tableNameTaken: true } : null)
      );
  }
}
