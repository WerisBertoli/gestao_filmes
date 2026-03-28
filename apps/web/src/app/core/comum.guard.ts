import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Impede ADMIN de acessar busca / favoritos / assistidos (fluxo exclusivo COMUM). */
export const comumGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) {
    void router.navigate(['/app/admin/rankings']);
    return false;
  }
  return true;
};
