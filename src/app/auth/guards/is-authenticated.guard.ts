import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {AuthStatus} from "../interfaces/auth-status.enum";

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus === AuthStatus.AUTHENTICATED) {
    return true;
  }

  router.navigate(['/auth/login']);

  return false;
};
