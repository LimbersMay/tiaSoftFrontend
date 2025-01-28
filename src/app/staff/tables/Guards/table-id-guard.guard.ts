import { CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const tableIdGuardGuard: CanActivateFn = (route, state) => {
  const routerService = inject(Router);

  const tableId = route.queryParams['tableId'];

  if (!tableId) {
    routerService.navigate(['/staff/tables/list']);
    return false;
  }

  return true;
};
