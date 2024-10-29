import { Injectable } from '@angular/core';
import { ErrorCodes} from "../error-codes.enum";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessages: { [key in ErrorCodes]: string } = {
    [ErrorCodes.AuthErrorIncorrectCredentials]: 'Correo o contraseña incorrectos',
    [ErrorCodes.AuthErrorEmailAlreadyExists]: 'El correo ya se encuentra registrado',
    [ErrorCodes.AuthErrorNotAuthorized]: 'No autorizado',
    [ErrorCodes.UserNotFound]: 'El usuario no fue encontrado',
    [ErrorCodes.UserNotUpdated]: 'Usuario no actualizado, ocurrió un error',
    [ErrorCodes.UserErrorWhenUpdatingUSer]: 'Error en la actualización del usuario',
    [ErrorCodes.UserErrorWhenCreatingUser]: 'Error durante la creación del usuario',
    [ErrorCodes.UserErrorUserNotCreated]: 'Usuario no creado, ocurrió un error',
  };

  public getErrorMessage(errorCode: ErrorCodes): string {
    return this.errorMessages[errorCode] || 'Ocurrió un error en el servidor al procesar la solicitud';
  }
}
