import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ErrorService} from "../../../shared/services/error.service";
import {ValidatorsService} from "../../../shared/services/validators.service";

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'auth-login-page',
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent {

  public loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  public anErrorOccurred: boolean = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private validatorsService: ValidatorsService
  ) {}

  public isValidField(field: keyof LoginForm): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  public getFieldError(field: keyof LoginForm): string | null {
    if (!this.loginForm.controls[field] ) return null;

    return this.validatorsService.getFieldError(this.loginForm, field);
  }

  public getControlClass(field: keyof LoginForm): string {
    return this.validatorsService.getControlClass(this.loginForm, field);
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (!this.loginForm.value.password || !this.loginForm.value.email) return;

    const { email, password } = this.loginForm.value;

    return this.authService.login(email, password)
      .subscribe({
        next: () => console.log('Login success'),
        error: (error) => {
          this.anErrorOccurred = true;
          this.errorMessage = this.errorService.getErrorMessage(error);
        }
      })
  }
}
