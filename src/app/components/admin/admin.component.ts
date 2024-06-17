import { Component } from '@angular/core';
import { RouterLink, RouterOutlet} from '@angular/router';
import { ListReservasComponent } from './list-reservas/list-reservas.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
