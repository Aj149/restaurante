import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
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
import { LoginClComponent } from './components/auth/login-cl/login-cl.component';
import { RegisterClComponent } from './components/auth/register-cl/register-cl.component';
import { EditPlatosEsComponent } from './components/admin/edit-platos-es/edit-platos-es.component';
import { PlatosComponent } from './components/admin/platos/platos.component';
import { PopUpLugaresComponent } from './components/dashboard/pop-up-lugares/pop-up-lugares.component';




export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, },

  {
    path: 'admin', component: AdminComponent,

    children: [
      { path: 'likes', component: LikesComponent },
      { path: 'comentarios', component: ComentariosComponent, },
      { path: 'listaDeReservas', component: ListReservasComponent },
      { path: 'editarReserva/:id_reserva', component: EditReservasComponent },
      { path: 'listaDePlatos', component: PlatosComponent },
      { path: 'editarPlato/:id_plato', component: EditPlatosEsComponent }

    ]
  },





  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },


  {
    path: 'personal',
    component: PersonalComponent,
    children: [
      { path: 'personal1', component: Personal1Component },
      { path: 'personal2', component: Personal2Component },
      { path: 'personal3', component: Personal3Component },

    ]
  },


  { path: 'popUp', component: PopUpPlatosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login-cliente', component: LoginClComponent },
  { path: 'register-cliente', component: RegisterClComponent },
  { path: 'popUpLugares', component: PopUpLugaresComponent }, 
  // ver si vale las rutas del pop up de lugares y el de platos

];
