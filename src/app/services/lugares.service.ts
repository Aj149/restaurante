import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lugares } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  lugarUrl = environment.lugarUrl
      
      constructor(private httpClient: HttpClient) { }
    
      public obtenerLugares(): Observable<Lugares[]> {
        return this.httpClient.get<Lugares[]>(this.lugarUrl);
      }
    
      public id_Plato(id_plato: number): Observable<Lugares> {
        return this.httpClient.get<Lugares>(`${this.lugarUrl}/${id_plato}`);
      }
    
      public agregarLugares(nuevosPlatos: Lugares): Observable<any> {
        return this.httpClient.post<any>(`${this.lugarUrl}`, nuevosPlatos);
      }
    
      public update(id_lugar: number, lugares: Lugares): Observable<any> {
        return this.httpClient.patch<any>(`${this.lugarUrl}/${id_lugar}`, lugares);
      }
}
