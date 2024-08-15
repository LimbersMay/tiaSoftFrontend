import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {AuthService} from "../../services/auth.service";
import {ErrorService} from "../../../shared/services/error.service";
import {EmailValidator} from "../../../shared/validators/email-validator.service";
import {Router} from "@angular/router";

@Component({
  selector: 'auth-new-account-page',
  templateUrl: './new-account-page.component.html',
  styles: []
})
export class NewAccountPageComponent {

  public signInForm: FormGroup = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', {updateOn: 'blur', validators:[Validators.required, Validators.email], asyncValidators: [this.emailValidator]}],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualToFieldTwo('password', 'confirmPassword')
    ]
  });

  public anErrorOccurred: boolean = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  private validatorsService: ValidatorsService,
    private authService: AuthService,
    private errorService: ErrorService,
    private emailValidator: EmailValidator
  ) {}

  public isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.signInForm, field);
  }

  public getFieldError(field: string): string | null {
    if (!this.signInForm.controls[field]) return null;

    return this.validatorsService.getFieldError(this.signInForm, field);
  }

  public getControlClass(field: string): string {
    return this.validatorsService.getControlClass(this.signInForm, field);
  }

  public onSubmit() {

    if (!this.signInForm.valid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.signInForm.value;

    return this.authService.signIn(username, email, password)
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => {
          this.anErrorOccurred = true;
          this.errorMessage = this.errorService.getErrorMessage(error);
        }
      })
  }
}
