import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bebidas } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  bebidasUrl = environment.bebidasURL;

  constructor(private httpClient: HttpClient) { }

  public obtenerBebidas(): Observable<Bebidas[]> {
    return this.httpClient.get<Bebidas[]>(this.bebidasUrl);
  }

  public id_bebida(id_bebida: number): Observable<Bebidas> {
    return this.httpClient.get<Bebidas>(`${this.bebidasUrl}/${id_bebida}`);
  }

  public agregarBebida(nuevaBebida: Bebidas): Observable<any> {
    return this.httpClient.post<any>(`${this.bebidasUrl}`, nuevaBebida);
  }

  public eliminarBebida(id_bebida: number): Observable<any> {
return this.httpClient.delete<any>(`${this.bebidasUrl}/${id_bebida}`);
}


  public update(id_bebidas: number, bebida: Bebidas): Observable<any> {
    return this.httpClient.patch<any>(`${this.bebidasUrl}/${id_bebidas}`, bebida);
  }
}
