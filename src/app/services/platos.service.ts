import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platos } from '../models/dashboard';


@Injectable({
  providedIn: 'root'
})
export class PlatosService {

  platosUrl = environment.platosURL
    
    constructor(private httpClient: HttpClient) { }
  
    public obtenerPlatos(): Observable<Platos[]> {
      return this.httpClient.get<Platos[]>(this.platosUrl);
    }
  
    public id_Plato(id_plato: number): Observable<Platos> {
      return this.httpClient.get<Platos>(`${this.platosUrl}/${id_plato}`);
    }
  
    public agregarPlatos(nuevaPlatos: Platos): Observable<any> {
      return this.httpClient.post<any>(`${this.platosUrl}`, nuevaPlatos);
    }
  
    public update(id_platos: number, platos: Platos): Observable<any> {
      return this.httpClient.patch<any>(`${this.platosUrl}/${id_platos}`, platos);
    }
}
