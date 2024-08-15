import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {AuthStatus} from "../interfaces/auth-status.enum";

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus === AuthStatus.AUTHENTICATED) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
