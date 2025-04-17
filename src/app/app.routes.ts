import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/admin/login/login.component';
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

import { AuthRegisterComponent } from './components/auth/auth/auth-register/auth-register.component';
import { AuthComponent } from './components/auth/auth/auth.component';
import { authGuard } from './services/auth.guard';



export const routes: Routes = [
  // Ruta de login (pública)
  { path: 'login', component: AuthComponent },
  
  // Ruta de registro (pública)
  { path: 'register', component: AuthRegisterComponent },
  
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