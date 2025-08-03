import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario, Lugares } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  lugarUrl = environment.lugarUrl
      
      constructor(private httpClient: HttpClient) { }
    
      public obtenerLugares(): Observable<Lugares[]> {
        return this.httpClient.get<Lugares[]>(this.lugarUrl);
      }
    
      public id_lugar(id_plato: number): Observable<Lugares> {
        return this.httpClient.get<Lugares>(`${this.lugarUrl}/${id_plato}`);
      }
    
      public agregarLugares(nuevosPlatos: Lugares): Observable<any> {
        return this.httpClient.post<any>(`${this.lugarUrl}`, nuevosPlatos);
      }

      public eliminarLugar(id_lugar: number): Observable<any> {
  return this.httpClient.delete<any>(`${this.lugarUrl}/${id_lugar}`);
}

    
      public update(id_lugar: number, lugares: Lugares): Observable<any> {
        return this.httpClient.patch<any>(`${this.lugarUrl}/${id_lugar}`, lugares);
      }








      // HORARIOS DE LOS LUGARES

      horarioUrl = environment.horarioUrl

      getHorariosPorDia(dia: string): Observable<Horario[]> {
    return this.httpClient.get<Horario[]>(`${this.horarioUrl}/dia/${dia}`);
  }

  updateHorario(id: number, horario: Horario) {
  return this.httpClient.patch<Horario>(`${this.horarioUrl}/${id}`, horario);
}
  agregarHorario(horario: Horario): Observable<Horario> {
    return this.httpClient.post<Horario>(this.horarioUrl, horario);
  }

  eliminarHorario(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.horarioUrl}/${id}`);
  }

  getHorariosPorLugar(id_lugar: number): Observable<Horario[]> {
  return this.httpClient.get<Horario[]>(`${this.horarioUrl}/lugar/${id_lugar}`);
}

getHorariosPorLugarYDia(id_lugar: number, dia: string): Observable<Horario[]> {
  return this.httpClient.get<Horario[]>(`${this.horarioUrl}/lugar/${id_lugar}/dia/${dia}`);
}


}
