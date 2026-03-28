import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DxButtonModule],
  template: `
<<<<<<< Updated upstream
    <header class="bar">
      <span class="brand">Gestão Filmes</span>
      <nav>
        <a routerLink="/app/busca" routerLinkActive="active">Busca</a>
        <a routerLink="/app/favoritos" routerLinkActive="active">Favoritos</a>
        <a routerLink="/app/assistidos" routerLinkActive="active">Assistidos</a>
        @if (auth.isAdmin()) {
          <a routerLink="/app/admin/rankings" routerLinkActive="active"
            >Rankings</a
          >
          <a routerLink="/app/admin/usuarios" routerLinkActive="active"
            >Usuários</a
          >
        }
      </nav>
      <div class="spacer"></div>
      <span class="user">{{ auth.getPayload()?.email }}</span>
      <dx-button
        text="Sair"
        stylingMode="outlined"
        type="normal"
        (onClick)="auth.logout()"
      />
=======
    <header class="header">
      <div class="header-inner">
        <a [routerLink]="auth.isAdmin() ? '/app/admin/rankings' : '/app/busca'" class="brand">
          <div class="brand-logo">MK</div>
          <div class="brand-text">
            <span class="brand-name">Microkids</span>
            <span class="brand-sub">Gestão de Filmes</span>
          </div>
        </a>
        <nav class="nav">
          @if (auth.isAdmin()) {
            <a routerLink="/app/admin/rankings" routerLinkActive="active">Rankings</a>
            <a routerLink="/app/admin/usuarios" routerLinkActive="active">Usuários</a>
          } @else {
            <a routerLink="/app/busca" routerLinkActive="active">Buscar</a>
            <a routerLink="/app/favoritos" routerLinkActive="active">Favoritos</a>
            <a routerLink="/app/assistidos" routerLinkActive="active">Assistidos</a>
          }
        </nav>
        <div class="spacer"></div>
        <div class="user-area">
          <div class="user-pill">
            <div class="user-avatar">{{ (auth.getPayload()?.email ?? 'U')[0].toUpperCase() }}</div>
            <span class="user-email">{{ auth.getPayload()?.email }}</span>
            @if (auth.isAdmin()) {
              <span class="role-badge admin">Admin</span>
            } @else {
              <span class="role-badge comum">Comum</span>
            }
          </div>
          <button class="btn-logout" (click)="auth.logout()">Sair</button>
        </div>
      </div>
>>>>>>> Stashed changes
    </header>
    <main class="main">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1.25rem;
        border-bottom: 1px solid #e0e0e0;
        background: #fafafa;
      }
      .brand {
        font-weight: 600;
      }
      nav {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      nav a {
        text-decoration: none;
        color: #1976d2;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }
      nav a.active {
        background: #e3f2fd;
        font-weight: 500;
      }
      .spacer {
        flex: 1;
      }
      .user {
        font-size: 0.9rem;
        color: #555;
      }
      .main {
        padding: 1rem 1.25rem;
      }
    `,
  ],
})
export class ShellComponent {
  readonly auth = inject(AuthService);
}
