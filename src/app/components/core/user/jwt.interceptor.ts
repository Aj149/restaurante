import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const adminService = inject(AdminService);

  // Verifica si la petición es para un usuario o un administrador
  let token: string | null = null;

  // Si la URL de la petición es de admin, utiliza el AdminService para obtener el token
  if (req.url.includes('/admin/') && adminService.getToken()) {
    token = adminService.getToken();
  }
  // Si no, utiliza el AuthService para obtener el token
  else if (authService.getToken()) {
    token = authService.getToken();
  }

  // Excluye endpoints de login y registro para usuario
  if ((req.url.includes('/auth/login') || req.url.includes('/auth/registro')) || !token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));

};