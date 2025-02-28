import { Pipe, PipeTransform } from '@angular/core';
import { reserva } from '../models/dashboard';
import { info } from 'console';

@Pipe({
  name: 'buscador',
  standalone: true
})
export class BuscadorPipe implements PipeTransform {

  transform(reserva: reserva[], searchTerm: string): reserva[] {
    if(!searchTerm || searchTerm.trim() === ''){
      return reserva;
    }
    const searchTermLower = searchTerm.toLowerCase();

    return reserva.filter((reserva: reserva) => 
    reserva.nombre.toLowerCase().includes(searchTermLower))
  }

}
