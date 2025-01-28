import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError} from "rxjs";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {ErrorService} from "../services/error.service";
import {ErrorCodes} from "../error-codes.enum";

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageProvider = inject(MessageService);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(error);

      const errorMessage = errorService.getErrorMessage(error.error);

      if (error.error === ErrorCodes.AuthErrorNotAuthorized) {
        throw error;
      }

      messageProvider.add({severity: 'error', summary: 'Error', detail: errorMessage});

      throw error;
    })
  )
};

