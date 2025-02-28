import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComentariosService } from '../../../services/comentarios.service';
import Swal from 'sweetalert2';
import { Comentarios } from '../../../models/dashboard';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [RouterOutlet,AdminComponent, RouterLink, NgxPaginationModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {

  comentario : Comentarios [] =[];
  
  nombre = '';
  public page!: number;

  constructor(
    private comentariosService: ComentariosService
  ){}

  ngOnInit(): void {
    this.listarComentarios();
  }


  listarComentarios(): void {
    this.comentariosService.obtenerMensaje().subscribe({
      next: (Comentarios: Comentarios[]) => {
        this.comentario = Comentarios;
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }


  borrar(id_comentario: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.comentariosService.borrarMensaje(id_comentario).subscribe({
          next: (response: any) => {
            console.log('Usuario eliminado correctamente', response);
            Swal.fire(
              'Eliminado!',
              'El registro ha sido eliminado correctamente.',
              'success'
            );
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          error: (error: any) => {
            console.error('Error al eliminar el registro', error);
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar el registro.',
              'error'
            );
          }
        });
      }
    });
  }
}
