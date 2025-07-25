// src/app/guards/admin-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

export const adminAuthGuard: CanActivateFn = () => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  const token = adminService.getToken();

  if (!token || adminService.isTokenExpired()) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return router.createUrlTree(['/loginAdmin']);
  }

  return true;
};
