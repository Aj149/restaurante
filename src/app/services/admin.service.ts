import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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
  login(credentials: { cedula: number; password: string }): Observable<any> {
    this.isLoading.next(true);
    return this.http.post<{ access_token: string }>(
      `${environment.authUrl}/admin/login`, 
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

  public getUserData(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

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

  // admin.service.ts
// admin.service.ts
public logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token'); // <-- Esta clave debe coincidir
    localStorage.removeItem('userData'); // Si también guardas datos del usuario
  }

  this.isAuthenticatedSubject.next(false);
  this.router.navigate(['/loginAdmin']);
}



  recuperarCorreo(correo:string) {
    return this.http.post(`${environment.adminUrl}/admin/forgot-password`, {correo});
  }
}
