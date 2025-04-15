import { Component } from '@angular/core';
import { Platos } from '../../../models/dashboard';
import { PlatosService } from '../../../services/platos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './platos.component.html',
  styleUrl: './platos.component.css'
})
export class PlatosComponent {

    plato : Platos [] =[];

    constructor (
      private platosService: PlatosService
    ) {}

    ngOnInit(): void {
      this.listarPlatos();
    }

    listarPlatos(): void {
    this.platosService.obtenerPlatos().subscribe({
      next: (Platos: Platos[]) => {
        this.plato = Platos;
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }
}
