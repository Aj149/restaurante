import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LikesComponent } from './components/admin/likes/likes.component';
import { ComentariosComponent } from './components/admin/comentarios/comentarios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Personal1Component } from './components/dashboard/personal/personal1/personal1.component';
import { PersonalComponent } from './components/dashboard/personal/personal.component';
import { Personal2Component } from './components/dashboard/personal/personal2/personal2.component';
import { Personal3Component } from './components/dashboard/personal/personal3/personal3.component';
import { ListReservasComponent } from './components/admin/list-reservas/list-reservas.component';
import { EditReservasComponent } from './components/admin/edit-reservas/edit-reservas.component';
import { PopUpPlatosComponent } from './components/dashboard/pop-up-platos/pop-up-platos.component';
import { CarritoComponent } from './components/dashboard/carrito/carrito.component';
import { EditPlatosEsComponent } from './components/admin/edit-platos-es/edit-platos-es.component';
import { PlatosComponent } from './components/admin/platos/platos.component';
import { PopUpLugaresComponent } from './components/dashboard/pop-up-lugares/pop-up-lugares.component';

import { authGuard } from './services/auth.guard';
import { UserComponent } from './components/core/user/user.component';
import { UserRegisterComponent } from './components/core/user/user-register/user-register.component';
import { LoginAdminComponent } from './components/core/admin/login-admin/login-admin.component';
import { RecuperarContrasenaComponent } from './components/core/recuperar-contrasena/recuperar-contrasena.component';
import { ResetPasswordComponent } from './components/core/reset-password/reset-password.component';
import { PopUpPersonalComponent } from './components/dashboard/pop-up-personal/pop-up-personal.component';



export const routes: Routes = [
  // Ruta de login (pública)
  { path: 'login', component: UserComponent },
  
  { path: 'admin', component: LoginAdminComponent },
  
  // Ruta de registro (pública)
  { path: 'register', component: UserRegisterComponent },
  
  { path: 'recuperarContraseña', component: RecuperarContrasenaComponent },

  { path: 'reset-password', component: ResetPasswordComponent },

  
  // Admin (protegido)
  {
    path: 'admin',
    component: AdminComponent,
    
    children: [
      { path: 'likes', component: LikesComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { path: 'lista-de-reservas', component: ListReservasComponent },
      { path: 'editar-reserva/:id_reserva', component: EditReservasComponent },
      { path: 'lista-de-platos', component: PlatosComponent },
      { path: 'editar-plato/:id_plato', component: EditPlatosEsComponent }
    ]
  },

  // Dashboard (protegido)
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  // Personal (protegido)
  {
    path: 'personal',
    component: PersonalComponent,
    children: [
      { path: 'personal1', component: Personal1Component },
      { path: 'personal2', component: Personal2Component },
      { path: 'personal3', component: Personal3Component }
    ]
  },

  // Extras (protegidos según necesidad)
  {path: 'pop-up-personal', component: PopUpPersonalComponent},
  
  { 
    path: 'pop-up-platos', 
    component: PopUpPlatosComponent,
  },
  { 
    path: 'pop-up-lugares', 
    component: PopUpLugaresComponent,
  },
  { 
    path: 'carrito', component: CarritoComponent, canActivate: [authGuard],
  },
  


  // Ruta desconocida (redirigir a dashboard protegido)
  { path: '**', redirectTo: 'dashboard' }
];