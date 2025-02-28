import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reserva } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  reservasUrl = environment.reservasURL
  
  constructor(private httpClient: HttpClient) { }

  public obtenerReserva(): Observable<reserva[]> {
    return this.httpClient.get<reserva[]>(this.reservasUrl);
  }

  public idReserva(id_reserva: number): Observable<reserva> {
    return this.httpClient.get<reserva>(`${this.reservasUrl}/${id_reserva}`);
  }

  public agregarReserva(nuevaReserva: reserva): Observable<any> {
    return this.httpClient.post<any>(`${this.reservasUrl}`, nuevaReserva);
  }

  public update(id_reserva: number, reserva: reserva): Observable<any> {
    return this.httpClient.patch<any>(`${this.reservasUrl}/${id_reserva}`, reserva);
  }

  public delete(id_reserva: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.reservasUrl}/${id_reserva}`);
  }

}
