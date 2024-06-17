import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [RouterOutlet,AdminComponent],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {

}
