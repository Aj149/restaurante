import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { PerfilComponent} from "./perfil/perfil.component";



export const routesDashboard: Routes = [
    {path: 'dashboard',
    component: DashboardComponent,
children:[
    {path: '', component: PerfilComponent},
    {path: 'perfil', component: PerfilComponent},
    
]}
]