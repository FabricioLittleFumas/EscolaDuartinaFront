import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';

export const podeAcessarLogSystem: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const autorizado = authService.temAuthority('ADMIN');

  return autorizado ? true : router.createUrlTree(['/home']);
};
