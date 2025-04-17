import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
  
    const token = auth.getToken();
    if (!token || auth.isTokenExpired()) {
      auth.logout(); // Limpia el estado si el token es inválido
      return router.createUrlTree(['/login']);
    }
    return true;
  };
