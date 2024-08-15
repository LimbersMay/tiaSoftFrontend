import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../../environments/environments";
import {User} from "../interfaces/user.interface";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {AuthStatus} from "../interfaces/auth-status.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseURL;
  private _user?: User;
  private authStatus: AuthStatus = AuthStatus.NOT_AUTHENTICATED;

  constructor(private httpClient: HttpClient) {}

  public get currentUser(): User | undefined {
    return this._user;
  }

  public login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.httpClient.post<User>(url, body, {
      withCredentials: true
    })
      .pipe(
        tap(user => this._user = user),
        tap(() => this.authStatus = AuthStatus.AUTHENTICATED),
        map(() => true),

        catchError(err => throwError(() => err.error))
      );
  }
}
