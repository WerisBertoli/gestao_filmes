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
    const payload = {
      email: body.email.trim().toLowerCase(),
      password: body.password,
    };
    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/auth/login`, payload)
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
    const payload = {
      email: body.email.trim().toLowerCase(),
      password: body.password,
    };
    return this.http
      .post<{ accessToken: string }>(
        `${environment.apiUrl}/auth/register`,
        payload,
      )
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
    const parts = t.split('.');
    if (parts.length < 2) {
      return null;
    }
    const json = AuthService.decodeBase64Url(parts[1]);
    if (!json) {
      return null;
    }
    try {
      const raw = JSON.parse(json) as Record<string, unknown>;
      const sub = raw['sub'];
      const email = raw['email'];
      const roleRaw = String(raw['role'] ?? '').toUpperCase();
      if (typeof sub !== 'string' || typeof email !== 'string') {
        return null;
      }
      if (roleRaw !== 'ADMIN' && roleRaw !== 'COMUM') {
        return null;
      }
      return { sub, email, role: roleRaw as JwtPayload['role'] };
    } catch {
      return null;
    }
  }

  /** JWT usa base64url; `atob` exige base64 padrão com padding. */
  private static decodeBase64Url(segment: string): string | null {
    try {
      const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padLen = (4 - (base64.length % 4)) % 4;
      const padded = base64 + '='.repeat(padLen);
      return atob(padded);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getPayload()?.role === 'ADMIN';
  }

  postLoginPath(): string {
    return this.isAdmin() ? '/app/admin/rankings' : '/app/busca';
  }
}
