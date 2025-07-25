import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { ListReservasComponent } from './list-reservas/list-reservas.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

constructor (
  private router: Router,
  private adminService: AdminService
) {}

logout() {
  this.adminService.logout();
}

  
}
