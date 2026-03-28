import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type JwtPayload = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'COMUM';
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private static readonly TOKEN_KEY = 'access_token';

  login(body: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/login`, body)
      .pipe(
        tap((res) =>
          localStorage.setItem(AuthService.TOKEN_KEY, res.accessToken),
        ),
      );
  }

  register(body: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/register`, body)
      .pipe(
        tap((res) =>
          localStorage.setItem(AuthService.TOKEN_KEY, res.accessToken),
        ),
      );
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getPayload(): JwtPayload | null {
    const t = this.getToken();
    if (!t) {
      return null;
    }
    try {
      const payload = t.split('.')[1];
      const json = atob(payload);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getPayload()?.role === 'ADMIN';
  }
}
