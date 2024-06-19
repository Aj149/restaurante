import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Comentarios } from '../models/comentarios';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  
  comentariosURL = environment.comentariosURL
  
  constructor(private httpClient: HttpClient) { }

  public obtenerMensaje(): Observable<Comentarios[]> {
    return this.httpClient.get<Comentarios[]>(this.comentariosURL);
  }

  public idMensaje(id_Comentarios: number): Observable<Comentarios> {
    return this.httpClient.get<Comentarios>(`${this.comentariosURL}/${id_Comentarios}`);
  }

  public agregarMensaje(nuevoMensaje: Comentarios): Observable<any> {
    return this.httpClient.post<any>(`${this.comentariosURL}`, nuevoMensaje);
  }

  public editMensaje(id_mensajes: number, Comentarios: Comentarios): Observable<any> {
    return this.httpClient.patch<any>(`${this.comentariosURL}/${id_mensajes}`, Comentarios);
  }

  public borrarMensaje(id_Comentarios: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.comentariosURL}/${id_Comentarios}`);
  }

}
