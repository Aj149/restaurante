import { Component } from '@angular/core';
import { Platos } from '../../../models/dashboard';
import { PlatosService } from '../../../services/platos.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

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

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.platosService.eliminarPlato(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El plato ha sido eliminado.', 'success');
            this.listarPlatos(); // Para refrescar la lista sin redirigir
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el plato.', 'error');
          }
        });
      }
    });
  }
  
}
