import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    void router.navigate(['/login']);
    return false;
  }
  if (!auth.isAdmin()) {
    void router.navigate(['/app/busca']);
    return false;
  }
  return true;
};
