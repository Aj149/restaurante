import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Usuarios } from '../models/registroUsuario';
import { MyJwtPayload } from '../models/dashboard';





@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_data';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkAuthState();
  }

  // Método para login
  login(credentials: { email: string; password: string }): Observable<any> {
    this.isLoading.next(true);
    return this.http.post<{ access_token: string }>(
      `${environment.authUrl}/usuarios/login`, 
      credentials,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.next(false))
    );
  }
// metodo para devolver el estado de autenticacion
  public isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  

  // Método para registro
  register(userData: any): Observable<any> {
    this.isLoading.next(true);
    return this.http.post<{ access_token: string }>(
      `${environment.authUrl}/usuarios/registro`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  // Métodos comunes de autenticación
  private handleAuthResponse(response: any): void {
    if (response?.access_token) {
      this.setToken(response.access_token);
      this.setUserData(response.user || this.getTokenPayload());
      this.isAuthenticatedSubject.next(true);
      this.router.navigate(['/carrito']);
    }
  }

  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);
    // Puedes agregar lógica específica para manejar diferentes tipos de errores
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Agregar otros headers necesarios
    });
  }

  // Métodos para manejo de token y estado de autenticación
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token); // <- importante: usar exactamente 'token'

  }

  private setUserData(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
    // 4para los pedidos en el carrito
    

    saveUserFromToken(token: string): void {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
    
        const user = {
          id: decoded.sub,
          email: decoded.email,
          nombre: decoded.nombre,    // Ahora debería estar aquí
          apellido: decoded.apellido, // Ahora debería estar aquí
          telefono: decoded.telefono, // Ahora debería estar aquí
          direccion: decoded.direccion, // Ahora debería estar aquí
        };
    
        localStorage.setItem('userData', JSON.stringify(user));
      } catch (e) {
        console.error('Error al decodificar el token JWT:', e);
      }
    }
    
   
    


    getUserData(): Usuarios | null {
      const data = localStorage.getItem('userData');
    
      if (!data || data === 'undefined') {
        console.warn('No se encontraron datos válidos del usuario en localStorage.');
        return null;
      }
    
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        return null;
      }
    }
    
    


  // 4################################

  public getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  public checkAuthState(): void {
    const token = this.getToken();
    const isAuthenticated = !!token && !this.isTokenExpired();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  public isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return true;
    return payload.exp < (Date.now() / 1000);
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
// recuperar contraseña
sendRecoveryEmail(email: string) {
  return this.http.post(`${environment.authUrl}/usuarios/forgot-password`, { email });
}

  
}