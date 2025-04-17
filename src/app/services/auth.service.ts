import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'access_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isLoading = false;

  

  constructor() {
    
  }

  login(credentials: { email: string; password: string }) {
    this.isLoading = true;
    return this.http.post<{ access_token: string }>(`${environment.autUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response?.access_token) {
          this.setToken(response.access_token);  // Guardamos el token solo si es válido
          this.isAuthenticatedSubject.next(true);
        } 
         
        
      }),
      finalize(() => this.isLoading = false)
    );
  }
  

  

  logout() {
    // Eliminar el token del localStorage
    localStorage.removeItem(this.TOKEN_KEY);  // Limpia el token del localStorage
  
    // Cambiar el estado de autenticación
    this.isAuthenticatedSubject.next(false);
    window.location.href = '/login';
    this.router.navigate(['/login']);
  }
  

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
// comentario para saber si ya llego el token
      return token;
    }
    return null;
  }
  
  
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
  
  private checkAuthState(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);  // ← Esto asegura que si hay token, se considere autenticado
  }

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
  
  isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return true;
  
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}