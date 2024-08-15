import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  constructor() { }

  public isValidField( form: FormGroup, field: string ) {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  public getFieldError(form: FormGroup, field: string): string | null {

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido'
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`
        case 'email':
          return 'El correo electrónico no es válido'
        case 'notEqual':
          return 'Las contraseñas no coinciden'
      }
    }

    return null;
  }

  public isFieldOneEqualToFieldTwo = ( field1: string, field2: string ) => {
    return ( formGroup: AbstractControl ): ValidationErrors | null => {

      const pass1 = formGroup.get(field1)?.value;
      const pass2 = formGroup.get(field2)?.value;

      const field2Errors = formGroup.get(field2)?.errors;

      if (pass1 !== pass2) {
        formGroup.get(field2)?.setErrors({ ...field2Errors, notEqual: true });
        return { notEqual: true };
      }

      delete formGroup.get(field2)?.errors?.['notEqual'];

      return null;
    }
  }

  public getControlClass(form: FormGroup, field: string): string {
    const control = form.get(field);
    return control?.invalid && (control.touched || control.dirty) ? 'ng-invalid ng-dirty' : '';
  }
}
