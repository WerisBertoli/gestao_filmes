import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Rotas exclusivas de usuário COMUM (busca, favoritos, assistidos).
 * Administrador é redirecionado para a área admin.
 */
export const comumGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) {
    void router.navigate(['/app/admin/rankings']);
    return false;
  }
  return true;
};
