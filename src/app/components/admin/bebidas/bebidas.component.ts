import { Component } from '@angular/core';
import { Bebidas } from '../../../models/dashboard';
import { BebidasService } from '../../../services/bebidas.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent {


    bebida : Bebidas [] = [];

    constructor (
      private bebidasService: BebidasService
    ) {}

    ngOnInit(): void {
      this.listarBebidas();
    }

    // 1trae las bebidas de la base de datos
    listarBebidas(): void {
      this.bebidasService.obtenerBebidas().subscribe({
        next: (bebidas: Bebidas[]) => {
          this.bebida = bebidas;
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
        if(result.isConfirmed) {
          this.bebidasService.eliminarBebida(id).subscribe({
            next: () => {
              Swal.fire('Eliminado', 'La bebida ha sido eliminada.', 'success');
              this.listarBebidas(); // Para refrescar la lista sin redirigir
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              Swal.fire('Error', 'No se pudo eliminar la bebida.', 'error');
            }
          });
        }
      })
    }
}
