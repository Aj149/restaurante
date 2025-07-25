import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { LikesComponent } from './components/admin/likes/likes.component';
import { ComentariosComponent } from './components/admin/comentarios/comentarios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
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
import { RecuperarContrasenaComponent } from './components/core/user/recuperar-contrasena/recuperar-contrasena.component';
import { ResetPasswordComponent } from './components/core/user/reset-password/reset-password.component';
import { PopUpPersonalComponent } from './components/dashboard/pop-up-personal/pop-up-personal.component';
import { EditPersonasComponent } from './components/admin/edit-personas/edit-personas.component';
import { PersonalComponent } from './components/admin/personal/personal.component';
import { CrearPersonalComponent } from './components/admin/crear-personal/crear-personal.component';
import { VerPersonalComponent } from './components/admin/ver-personal/ver-personal.component';
import { VerReservasComponent } from './components/admin/ver-reservas/ver-reservas.component';
import { CrearPlatoComponent } from './components/admin/crear-plato/crear-plato.component';
import { LugaresComponent } from './components/admin/lugares/lugares.component';
import { EditLugarComponent } from './components/admin/edit-lugar/edit-lugar.component';
import { CrearLugarComponent } from './components/admin/crear-lugar/crear-lugar.component';
import { BebidasComponent } from './components/admin/bebidas/bebidas.component';
import { EditBebidaComponent } from './components/admin/edit-bebida/edit-bebida.component';
import { RecuperarComponent } from './components/core/admin/recuperar/recuperar.component';
import { adminAuthGuard } from './services/admin.guard';
import { ResetComponent } from './components/core/admin/reset/reset.component';



export const routes: Routes = [
  // Ruta de login (pública)
  { path: 'login', component: UserComponent },
  
  { path: 'loginAdmin', component: LoginAdminComponent },
  
  // Ruta de registro (pública)
  { path: 'register', component: UserRegisterComponent },
  
  { path: 'recuperarContraseña', component: RecuperarContrasenaComponent },
  
  { path: 'recuperarAdmin', component: RecuperarComponent },

  { path: 'reset-password', component: ResetPasswordComponent },
  
  { path: 'admin/reset-password', component: ResetComponent },




  
  // Admin (protegido)
  {
    path: 'admin',
    component: AdminComponent, canActivate: [adminAuthGuard],
    
    children: [
      { path: 'likes', component: LikesComponent },
      { path: 'comentarios', component: ComentariosComponent },
      { path: 'lista-de-reservas', component: ListReservasComponent },
      { path: 'editar-reserva/:id_reserva', component: EditReservasComponent },
      { path: 'verReserva/:id_reserva', component: VerReservasComponent },
      { path: 'lista-de-platos', component: PlatosComponent },
      { path: 'editar-plato/:id_plato', component: EditPlatosEsComponent },
      { path: 'crearPlato', component: CrearPlatoComponent },
      { path: 'listaPersonal', component: PersonalComponent },
      { path: 'editar-personal/:id_personal', component: EditPersonasComponent },
      { path: 'crearPersonal', component: CrearPersonalComponent },
      { path: 'verPersonal/:id_personal', component: VerPersonalComponent },
      { path: 'lugares', component: LugaresComponent },
      { path: 'crearlugar', component: CrearLugarComponent },
      { path: 'editar-lugar/:id_lugar', component: EditLugarComponent },
      { path: 'editar-bebida/:id_bebida', component: EditBebidaComponent },
      { path: 'bebidas', component: BebidasComponent },

    ]
  },

  // Dashboard (protegido)
  {
    path: 'dashboard',
    component: DashboardComponent
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