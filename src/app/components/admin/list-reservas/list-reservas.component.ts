import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormularioService } from '../../../services/formulario.service';
import { reserva } from '../../../models/reserva';
import { BuscadorPipe } from '../../../pipe/buscador.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-list-reservas',
  standalone: true,
  imports: [RouterOutlet, RouterLink, BuscadorPipe, NgxPaginationModule ],
  templateUrl: './list-reservas.component.html',
  styleUrl: './list-reservas.component.css'
})
export class ListReservasComponent implements OnInit  {

  nombre = '';
  public page!: number;
  // buscar reserva
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
    if (event.target instanceof HTMLInputElement) { // Verificar si el target es un input
      const searchTerm = event.target.value; // Obtener el valor del input
      this.searchTerm$.next(searchTerm); // Enviar el valor al Subject
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
  this.cargarReservas();
  this.listarReservas();
  this.filterList();
}

 cargarReservas(): void {
    this.formularioService.obtenerReserva().subscribe({
      next: (data: reserva[]) => {
        this.reservas = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }



borrar(id_reserva: number) {
  if (confirm('¿Está seguro que desea eliminar la reserva?')) {
    this.formularioService.delete(id_reserva).subscribe({
      next: (response: any) => {
        console.log('reserva eliminada correctamente', response);
        alert('Reserva eliminada correctamente');
        window.location.reload();
        this.cargarReservas();
      },
      error: (error: any) => {
        console.error('Error al eliminar la reserva', error);
        alert('Error al eliminar la reserva');
      }
    });
  }
}

}
