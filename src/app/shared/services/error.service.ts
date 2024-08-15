import { Injectable } from '@angular/core';
import { ErrorCodes} from "../error-codes.enum";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessages: { [key in ErrorCodes]: string } = {
    [ErrorCodes.AuthErrorIncorrectCredentials]: 'Correo o contraseña incorrectos',
    [ErrorCodes.AuthErrorEmailAlreadyExists]: 'El correo ya se encuentra registrado',
  };

  public getErrorMessage(errorCode: ErrorCodes): string {
    return this.errorMessages[errorCode] || 'Ocurrió un error desconocido';
  }
}
