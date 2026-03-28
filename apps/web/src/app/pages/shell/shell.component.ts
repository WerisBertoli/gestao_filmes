import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DxButtonModule],
  template: `
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
