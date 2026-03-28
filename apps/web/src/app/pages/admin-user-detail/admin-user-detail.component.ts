import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, UserDetail } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <a routerLink="/app/admin/usuarios" class="back-link">&#8592; Voltar para Usuários</a>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando...</span></div>
      } @else if (user) {
        <div class="page-header profile-hero">
          <div class="profile-hero-left">
            <div class="hero-avatar">{{ user.email[0].toUpperCase() }}</div>
            <div class="profile-hero-text">
              <h2>{{ user.email }}</h2>
              <p class="subtitle">Perfil e listas deste usuário</p>
              @if (user.role === 'ADMIN') {
                <span class="role-pill role-admin">Admin</span>
              } @else {
                <span class="role-pill role-comum">Comum</span>
              }
            </div>
          </div>
          <div class="profile-hero-badges">
            <span class="count-badge badge-fav">{{ user.favorites.length }} favorito(s)</span>
            <span class="count-badge badge-watch">{{ user.watched.length }} assistido(s)</span>
            <span class="count-badge badge-date">Desde {{ user.createdAt | date: 'dd/MM/yyyy' }}</span>
          </div>
        </div>

        <div class="grid-2">
          <div class="list-block">
            <div class="list-head">
              <div>
                <span class="list-icon">&#9825;</span>
                <h3>Favoritos</h3>
              </div>
              @if (user.favorites.length) {
                <span class="mini-count">{{ user.favorites.length }}</span>
              }
            </div>
            @if (user.favorites.length === 0) {
              <div class="card empty-state">
                <div class="empty-icon">&#9825;</div>
                <p class="empty-title">Nenhum favorito</p>
                <p class="empty-text">Este usuário ainda não favoritou filmes.</p>
              </div>
            } @else {
              <div class="card table-card">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="th-poster"></th>
                      <th>Título</th>
                      <th>Ano</th>
                      <th>IMDb</th>
                      <th>Adicionado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (r of user.favorites; track r.id) {
                      <tr>
                        <td class="td-poster">
                          @if (r.movie.poster && r.movie.poster !== 'N/A') {
                            <img class="mini-poster" [src]="r.movie.poster" [alt]="r.movie.title" />
                          } @else {
                            <div class="mini-poster-ph">&#127909;</div>
                          }
                        </td>
                        <td class="td-title">{{ r.movie.title }}</td>
                        <td class="td-center"><span class="year-chip year-fav">{{ r.movie.year }}</span></td>
                        <td class="td-mono">{{ r.movie.imdbId }}</td>
                        <td class="td-muted">{{ r.createdAt | date: 'dd/MM/yyyy' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <div class="list-block">
            <div class="list-head">
              <div>
                <span class="list-icon">&#127909;</span>
                <h3>Assistidos</h3>
              </div>
              @if (user.watched.length) {
                <span class="mini-count mini-count-watch">{{ user.watched.length }}</span>
              }
            </div>
            @if (user.watched.length === 0) {
              <div class="card empty-state">
                <div class="empty-icon">&#127909;</div>
                <p class="empty-title">Nenhum assistido</p>
                <p class="empty-text">Este usuário ainda não marcou filmes como assistidos.</p>
              </div>
            } @else {
              <div class="card table-card">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="th-poster"></th>
                      <th>Título</th>
                      <th>Ano</th>
                      <th>IMDb</th>
                      <th>Marcado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (r of user.watched; track r.id) {
                      <tr>
                        <td class="td-poster">
                          @if (r.movie.poster && r.movie.poster !== 'N/A') {
                            <img class="mini-poster" [src]="r.movie.poster" [alt]="r.movie.title" />
                          } @else {
                            <div class="mini-poster-ph mini-poster-ph-watch">&#127909;</div>
                          }
                        </td>
                        <td class="td-title">{{ r.movie.title }}</td>
                        <td class="td-center"><span class="year-chip year-watch">{{ r.movie.year }}</span></td>
                        <td class="td-mono">{{ r.movie.imdbId }}</td>
                        <td class="td-muted">{{ r.createdAt | date: 'dd/MM/yyyy' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [
    `
      .page {
        padding: 1.75rem 2rem;
        max-width: 1100px;
        margin: 0 auto;
      }
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: #6b7a99;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
        text-decoration: none;
        transition: color 0.15s;
      }
      .back-link:hover {
        color: #1d398c;
      }
      .loading-wrap {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
        color: #6b7a99;
        font-size: 0.875rem;
      }
      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 1.75rem;
        flex-wrap: wrap;
        gap: 1.25rem;
      }
      .profile-hero {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(29, 57, 140, 0.08);
        border: 1px solid #eef2ff;
        padding: 1.5rem 1.75rem;
      }
      .profile-hero-left {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        flex: 1;
        min-width: 220px;
      }
      .hero-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1d398c, #65ecec);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1.75rem;
        flex-shrink: 0;
        box-shadow: 0 6px 20px rgba(29, 57, 140, 0.2);
      }
      .profile-hero-text h2 {
        font-size: 1.35rem;
        font-weight: 800;
        margin: 0 0 0.25rem;
        color: #0f1a35;
        letter-spacing: -0.025em;
      }
      .subtitle {
        font-size: 0.875rem;
        color: #6b7a99;
        margin: 0 0 0.5rem;
      }
      .role-pill {
        display: inline-block;
        padding: 0.2rem 0.65rem;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .role-admin {
        background: #eaefff;
        color: #1d398c;
      }
      .role-comum {
        background: rgba(210, 224, 3, 0.15);
        color: #5a6b00;
      }
      .profile-hero-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        align-self: center;
      }
      .count-badge {
        font-size: 0.8rem;
        font-weight: 700;
        padding: 0.35rem 0.95rem;
        border-radius: 20px;
        white-space: nowrap;
      }
      .badge-fav {
        background: #eaefff;
        color: #1d398c;
      }
      .badge-watch {
        background: rgba(210, 224, 3, 0.18);
        color: #5a6b00;
      }
      .badge-date {
        background: #f4f7fc;
        color: #6b7a99;
        font-weight: 600;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        align-items: start;
      }
      @media (max-width: 900px) {
        .grid-2 {
          grid-template-columns: 1fr;
        }
      }
      .list-block {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .list-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.15rem;
      }
      .list-head > div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .list-icon {
        font-size: 1.15rem;
        line-height: 1;
      }
      .list-head h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f1a35;
        letter-spacing: -0.02em;
      }
      .mini-count {
        background: #eaefff;
        color: #1d398c;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.2rem 0.65rem;
        border-radius: 20px;
        min-width: 1.75rem;
        text-align: center;
      }
      .mini-count-watch {
        background: rgba(210, 224, 3, 0.18);
        color: #5a6b00;
      }
      .card {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(29, 57, 140, 0.08);
      }
      .empty-state {
        padding: 3rem 1.5rem;
        text-align: center;
        border: 1px solid #eef2ff;
      }
      .empty-icon {
        font-size: 2.25rem;
        margin-bottom: 0.65rem;
        opacity: 0.35;
      }
      .empty-title {
        font-weight: 700;
        font-size: 0.95rem;
        color: #3a4a6b;
        margin: 0 0 0.35rem;
      }
      .empty-text {
        font-size: 0.82rem;
        color: #6b7a99;
        margin: 0;
        line-height: 1.45;
      }
      .table-card {
        overflow: hidden;
        border: 1px solid #eef2ff;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table thead {
        border-bottom: 2px solid #eef2ff;
      }
      .table th {
        padding: 0.75rem 0.65rem;
        text-align: left;
        font-size: 0.65rem;
        font-weight: 700;
        color: #98a2be;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        background: #fafbff;
      }
      .th-poster {
        width: 56px;
      }
      .table td {
        padding: 0.55rem 0.65rem;
        border-bottom: 1px solid #f3f5fc;
        vertical-align: middle;
      }
      .table tbody tr:last-child td {
        border-bottom: none;
      }
      .table tbody tr:hover td {
        background: #f7f9ff;
      }
      .td-poster {
        width: 56px;
        padding: 0.4rem 0.45rem 0.4rem 0.65rem;
      }
      .mini-poster {
        width: 40px;
        height: 56px;
        object-fit: cover;
        border-radius: 6px;
        display: block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      .mini-poster-ph {
        width: 40px;
        height: 56px;
        border-radius: 6px;
        background: linear-gradient(135deg, #eaefff, #dde6ff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }
      .mini-poster-ph-watch {
        background: linear-gradient(135deg, rgba(210, 224, 3, 0.15), rgba(210, 224, 3, 0.05));
      }
      .td-title {
        font-weight: 600;
        font-size: 0.82rem;
        color: #0f1a35;
        line-height: 1.35;
      }
      .td-center {
        text-align: center;
      }
      .year-chip {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.15rem 0.5rem;
        border-radius: 20px;
      }
      .year-fav {
        background: #eaefff;
        color: #1d398c;
      }
      .year-watch {
        background: rgba(210, 224, 3, 0.18);
        color: #5a6b00;
      }
      .td-mono {
        font-family: monospace;
        font-size: 0.78rem;
        color: #6b7a99;
      }
      .td-muted {
        font-size: 0.78rem;
        color: #98a2be;
      }
      .msg-error {
        color: #d63939;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class AdminUserDetailComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  readonly id = input.required<string>();
  user: UserDetail | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getUserDetail(this.id()).subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = 'Usuário não encontrado ou sem permissão.';
        this.loading = false;
      },
    });
  }
}
