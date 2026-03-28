import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/**
 * Layout exclusivo ADMIN — no DOM não existem links de Buscar/Favoritos/Assistidos.
 */
@Component({
  selector: 'app-shell-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-inner">
        <a routerLink="/app/admin/rankings" class="brand">
          <div class="brand-logo">MK</div>
          <div class="brand-text">
            <span class="brand-name">Microkids</span>
            <span class="brand-sub">Administração</span>
          </div>
        </a>
        <nav class="nav" aria-label="Área administrativa">
          <a routerLink="/app/admin/rankings" routerLinkActive="active">Rankings</a>
          <a routerLink="/app/admin/usuarios" routerLinkActive="active">Usuários</a>
        </nav>
        <div class="spacer"></div>
        <div class="user-area">
          <div class="user-pill">
            <div class="user-avatar">{{ (auth.getPayload()?.email ?? 'A')[0].toUpperCase() }}</div>
            <span class="user-email">{{ auth.getPayload()?.email }}</span>
            <span class="role-badge admin">Admin</span>
          </div>
          <button type="button" class="btn-logout" (click)="auth.logout()">Sair</button>
        </div>
      </div>
    </header>
    <main class="main-content"><router-outlet /></main>
  `,
  styles: [
    `
      .header {
        background: linear-gradient(95deg, #0f1a35 0%, #1d398c 100%);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .header-inner {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 0 1.75rem;
        height: 64px;
        max-width: 1300px;
        margin: 0 auto;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        text-decoration: none;
      }
      .brand-logo {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #d2e003, #65ecec);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.85rem;
        color: #0f1a35;
        flex-shrink: 0;
      }
      .brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }
      .brand-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.01em;
      }
      .brand-sub {
        font-size: 0.68rem;
        color: rgba(255, 255, 255, 0.5);
        font-weight: 400;
      }
      .nav {
        display: flex;
        align-items: center;
        gap: 0.15rem;
      }
      .nav a {
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0.4rem 0.9rem;
        border-radius: 8px;
        transition: all 0.15s;
        white-space: nowrap;
      }
      .nav a:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        text-decoration: none;
      }
      .nav a.active {
        color: #0f1a35;
        background: #d2e003;
        font-weight: 600;
      }
      .spacer {
        flex: 1;
      }
      .user-area {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 50px;
        padding: 0.3rem 0.75rem 0.3rem 0.35rem;
      }
      .user-avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d2e003, #65ecec);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.7rem;
        color: #0f1a35;
        flex-shrink: 0;
      }
      .user-email {
        font-size: 0.78rem;
        color: rgba(255, 255, 255, 0.75);
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .role-badge {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 0.1rem 0.45rem;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .role-badge.admin {
        background: rgba(210, 224, 3, 0.25);
        color: #d2e003;
      }
      .btn-logout {
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 8px;
        padding: 0.35rem 0.9rem;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        font-family: inherit;
        white-space: nowrap;
      }
      .btn-logout:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.3);
      }
      .main-content {
        min-height: calc(100vh - 64px);
      }
    `,
  ],
})
export class ShellAdminComponent {
  readonly auth = inject(AuthService);
}
