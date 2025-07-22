import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personal } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  
  personalURL = environment.personalURL
  
  constructor(private httpClient: HttpClient) { }

  public obtenerPersonal(): Observable<Personal[]> {
    return this.httpClient.get<Personal[]>(this.personalURL);
  }

  public idPersonal(id_persona: number): Observable<Personal> {
    return this.httpClient.get<Personal>(`${this.personalURL}/${id_persona}`);
  }

  public agregarPersonal(nuevaPersona: Personal): Observable<any> {
    return this.httpClient.post<any>(`${this.personalURL}`, nuevaPersona);
  }

  public editPersonal(id_persona: number, Persona: Personal): Observable<any> {
    return this.httpClient.patch<any>(`${this.personalURL}/${id_persona}`, Persona);
  }

  public borrarPersonal(id_persona: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.personalURL}/${id_persona}`);
  }

}
