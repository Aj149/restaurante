import { Pipe, PipeTransform } from '@angular/core';
import { reserva } from '../models/dashboard';

@Pipe({
  name: 'buscador',
  standalone: true
})
export class BuscadorPipe implements PipeTransform {

  transform(reservas: reserva[], searchTerm: string): reserva[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return reservas;
    }
    const searchTermLower = searchTerm.toLowerCase();

    return reservas.filter((reserva: reserva) => 
      (reserva.nombre?.toLowerCase().includes(searchTermLower) || 
       reserva.email?.toLowerCase().includes(searchTermLower))
    );
  }

}
