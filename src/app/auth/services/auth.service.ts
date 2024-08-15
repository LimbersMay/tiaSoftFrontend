import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../../environments/environments";
import {User} from "../interfaces/user.interface";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {AuthStatus} from "../interfaces/auth-status.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseURL;
  private _user?: User;
  private _authStatus = AuthStatus.CHECKING;

  constructor(private httpClient: HttpClient) {}

  private setAuthentication(user: User): boolean{
    this._user = user;
    this._authStatus = AuthStatus.AUTHENTICATED;

    return true;
  }

  public get currentUser(): User | undefined {
    return this._user;
  }

  public get authStatus(): AuthStatus {
    return this._authStatus;
  }

  public login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.httpClient.post<User>(url, body, {
      withCredentials: true
    })
      .pipe(
        map((user) => this.setAuthentication(user)),
        catchError(err => throwError(() => err.error))
      );
  }

  public signIn(username: string, email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/signIn`;
    const body = { username, email, password };

    return this.httpClient.post<User>(url, body, {
      withCredentials: true
    })
      .pipe(
        map((user) => this.setAuthentication(user)),
        catchError(err => throwError(() => err.error))
      );
  }

  public checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/isAuthenticated`;
    return this.httpClient.get<User>(url, {withCredentials: true})
      .pipe(
        // Authenticated
        map((user) => this.setAuthentication(user)),

        // Not authenticated
        catchError((err) => {
          console.log(err);
          this._authStatus = AuthStatus.NOT_AUTHENTICATED;
          return of(false);
        })
      )
  }

  public logout(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/logout`;

    return this.httpClient.post(url, {}, {withCredentials: true})
      .pipe(
        map(() => {
          this._user = undefined;
          this._authStatus = AuthStatus.NOT_AUTHENTICATED;
          return true;
        }),
        catchError(err => throwError(() => err.error))
      );
  }
}
