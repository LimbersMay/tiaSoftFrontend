import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../../environments/environments";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "../../auth/interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public baseUrl: string = environments.baseURL;

  constructor(private readonly httpClient: HttpClient) {}

  public getUsers(): Observable<User[]> {

    const url = `${this.baseUrl}/users`;

    return this.httpClient.get<User[]>(url, {withCredentials: true})
      .pipe(
        map((resp: User[]) => resp),
        catchError( (err) => throwError(() => err))
      );
  }

  public updateUser(user: User): Observable<User> {
    const url = `${this.baseUrl}/users?userId=${user.userId}`;

    return this.httpClient.put<User>(url, user, {withCredentials: true})
      .pipe(
        map((user) => user),
        catchError((err) => throwError(() => err))
      );
  }

  public createUser(user: User): Observable<User> {
    const url = `${this.baseUrl}/users`;

    return this.httpClient.post<User>(url, user, {withCredentials: true})
      .pipe(
        map((user) => user),
        catchError((err) => throwError(() => err))
      );
  }
}
