import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginClService {
  private apiUrl = 'https://tu-api-segura.com/auth';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.initializeAuthState();
  }

  // Inicializar estado de autenticación
  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.tokenSubject.next(token);
      this.authStatusSubject.next(true);
    }
  }

  // Login con email y contraseña
  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Protección básica contra CSRF
    });

    return this.http.post(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap((response: any) => {
        this.handleAuthentication(response.token);
      }),
      catchError(this.handleError)
    );
  }

  // Registro de nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // Recuperación de contraseña
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Resetear contraseña con token
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejar la autenticación exitosa
  private handleAuthentication(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
    this.authStatusSubject.next(true);
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('auth_token');
    this.tokenSubject.next(null);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Obtener token almacenado
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Verificar si el token ha expirado
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  // Verificar estado de autenticación
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Obtener información del usuario desde el token
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;
    
    return this.jwtHelper.decodeToken(token);
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 0) {
        errorMessage = 'Error de conexión con el servidor';
      } else {
        errorMessage = error.error?.message || error.statusText;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}