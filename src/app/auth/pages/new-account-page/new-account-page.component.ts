import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidatorsService} from "../../../shared/services/validators.service";
import {LoginForm} from "../login-page/login-page.component";

interface SignInForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'auth-new-account-page',
  templateUrl: './new-account-page.component.html',
  styles: []
})
export class NewAccountPageComponent {

  public signInForm: FormGroup<SignInForm> = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualToFieldTwo('password', 'confirmPassword')
    ]
  });

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) {}

  public isValidField(field: keyof SignInForm): boolean | null {
    return this.validatorsService.isValidField(this.signInForm, field);
  }

  public getFieldError(field: keyof SignInForm): string | null {
    if (!this.signInForm.controls[field]) return null;

    return this.validatorsService.getFieldError(this.signInForm, field);
  }

  public getControlClass(field: keyof SignInForm): string {
    return this.validatorsService.getControlClass(this.signInForm, field);
  }

  public onSubmit(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    console.log(this.signInForm.value);
  }
}
