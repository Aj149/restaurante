import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormularioService } from '../../../services/formulario.service';

import { BuscadorPipe } from '../../../pipe/buscador.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, debounceTime, distinctUntilChanged, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { reserva } from '../../../models/dashboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-reservas',
  standalone: true,
  imports: [RouterLink, BuscadorPipe, NgxPaginationModule, FormsModule ],
  templateUrl: './list-reservas.component.html',
  styleUrl: './list-reservas.component.css'
})
export class ListReservasComponent implements OnInit  {

  nombre = '';
  public page!: number;
  searchTerm: string = '';
  searchTerm$ = new BehaviorSubject<string>('');
  
 

  reservas : reserva[] = [];
  
  reservasFiltradas: reserva[] = [];

  filterList(): void {
    this.searchTerm$
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
      this.reservasFiltradas = this.reservas
        .filter(reserva => reserva.nombre.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
                reserva.email.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    });
  }
  
  onSearch(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const searchTerm = event.target.value;
      this.searchTerm$.next(searchTerm); 
    }
  }


constructor(
  private formularioService: FormularioService
){}


listarReservas(): void {
  this.formularioService.obtenerReserva().subscribe({
    next: (reserva: reserva[]) => {
      this.reservas = reserva;
    },
    error: (err: Error) => {
      console.log(err);
    }
  });
}

ngOnInit(): void {
  this.listarReservas();
  this.filterList();
}



  borrar(id_reserva: number): void {
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
      this.formularioService.delete(id_reserva).subscribe({
        next: (response: any) => {
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
