import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {Role} from "../interfaces/role.interface";
import {environments} from "../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly baseUrl = environments.baseURL;

  constructor(private readonly httpClient: HttpClient) {}

  public getRoles(): Observable<Role[]> {
    const url = `${this.baseUrl}/roles`;

    return this.httpClient.get<Role[]>(url, { withCredentials: true})
      .pipe(
        tap((resp: Role[]) => console.log(resp)),
        map((resp: Role[]) => resp),
        catchError((err) => throwError(() => err))
      );
  }
}
