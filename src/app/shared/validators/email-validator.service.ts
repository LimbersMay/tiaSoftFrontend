import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {map, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class EmailValidator implements AsyncValidator{

  private baseUrl = environments.baseURL;

  constructor(private httpClient: HttpClient) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    const url = `${this.baseUrl}/users/emailexists?email=${email}`;

    return this.httpClient.get<boolean>(url)
      .pipe(
        map(resp => (resp) ? { emailTaken: true } : null)
      );
  }
}
