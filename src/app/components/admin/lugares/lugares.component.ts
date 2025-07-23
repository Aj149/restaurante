import { Component } from '@angular/core';
import { Lugares } from '../../../models/dashboard';
import { LugaresService } from '../../../services/lugares.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lugares.component.html',
  styleUrl: './lugares.component.css'
})
export class LugaresComponent {

  lugar: Lugares[] = [];

  constructor(
    private lugaresService: LugaresService
  ) {}

  ngOnInit(): void {
    this.listarLugares();
  }

  listarLugares(): void {
    this.lugaresService.obtenerLugares().subscribe({
      next: (Lugares: Lugares[]) => {
        this.lugar = Lugares;
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
        this.lugaresService.eliminarLugar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El lugar ha sido eliminado.', 'success');
            this.listarLugares(); // Para refrescar la lista sin redirigir
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire('Error', 'No se pudo eliminar el lugar.', 'error');
          }
        });
      }
    });
  }
}
