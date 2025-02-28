import { Routes } from '@angular/router';
import { LugaresComponent } from './components/dashboard/lugares/lugares.component';
import { Lugar1Component } from './components/dashboard/lugares/lugar1/lugar1.component';
import { Lugar2Component } from './components/dashboard/lugares/lugar2/lugar2.component';
import { Lugar4Component } from './components/dashboard/lugares/lugar4/lugar4.component';
import { Lugar3Component } from './components/dashboard/lugares/lugar3/lugar3.component';
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
import { Component } from '@angular/core';
import { PopUpPlatosComponent } from './components/pop-up-platos/pop-up-platos.component';




export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    { path: 'login', component: LoginComponent, },

    { path: 'admin', component: AdminComponent,
        
  children:[
    {path: 'likes', component: LikesComponent},
    {path: 'comentarios', component: ComentariosComponent,},
    {path: 'listaDeReservas', component: ListReservasComponent},
    {path: 'editarReserva/:id_reserva', component: EditReservasComponent}
    
  ]},





    {path: 'dashboard',
    component: DashboardComponent,
children:[
    {path: '', component: DashboardComponent},
    
]},


{path: 'personal',
component: PersonalComponent,
children:[
    {path: 'personal1', component: Personal1Component},
    {path: 'personal2', component: Personal2Component},
    {path: 'personal3', component: Personal3Component},
    
]},

  {path: 'lugares',
    component: LugaresComponent,
children:[
    {path: 'lugar1', component: Lugar1Component},
    {path: 'lugar2', component: Lugar2Component},
    {path: 'lugar3', component: Lugar3Component},
    {path: 'lugar4', component: Lugar4Component},
]},


{path: 'popUp', component: PopUpPlatosComponent}
];
