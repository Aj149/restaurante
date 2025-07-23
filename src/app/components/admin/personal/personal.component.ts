import { Component } from '@angular/core';
import { Personal } from '../../../models/dashboard';
import { PersonalService } from '../../../services/personal.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent {

  personal: Personal[] = [];

  constructor(
    private personalService: PersonalService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.listarPersonal();
  }

  listarPersonal(): void {
    this.personalService.obtenerPersonal().subscribe({
      next: (personal: Personal[]) => {
        this.personal = personal;
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  eliminarPersonal(id: number): void {
  if (!id) {
    console.error('ID inválido o no proporcionado');
    Swal.fire('Error', 'No se pudo obtener el ID del empleado.', 'error');
    return;
  }

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
      this.personalService.borrarPersonal(id).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El empleado ha sido eliminado.', 'success');
          this.listarPersonal(); // Para refrescar la lista sin redirigir
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
        }
      });
    }
  });
}



}
