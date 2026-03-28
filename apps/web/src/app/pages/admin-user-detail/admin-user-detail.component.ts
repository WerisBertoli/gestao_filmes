import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, UserDetail } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <a routerLink="/app/admin/usuarios" class="back-link">&#8592; Voltar para Usuários</a>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando...</span></div>
      } @else if (user) {
        <div class="hero card">
          <div class="hero-avatar">{{ user.email[0].toUpperCase() }}</div>
          <div class="hero-info">
            <h2>{{ user.email }}</h2>
            @if (user.role === 'ADMIN') {
              <span class="badge badge-admin">Admin</span>
            } @else {
              <span class="badge badge-comum">Comum</span>
            }
          </div>
          <div class="spacer"></div>
          <div class="stats">
            <div class="stat"><span class="stat-num">{{ user.favorites.length }}</span><span class="stat-label">Favoritos</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-num">{{ user.watched.length }}</span><span class="stat-label">Assistidos</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-num">{{ user.createdAt | date: 'dd/MM/yy' }}</span><span class="stat-label">Cadastro</span></div>
          </div>
        </div>
        <div class="grid-2">
          <div class="card section-card">
            <div class="sec-head">
              <span class="sec-icon">&#9825;</span>
              <h3>Favoritos</h3>
              <span class="sec-count">{{ user.favorites.length }}</span>
            </div>
            <dx-data-grid [dataSource]="user.favorites" [showBorders]="false" keyExpr="id" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Título"></dxi-column>
              <dxi-column dataField="movie.imdbId" caption="IMDb" [width]="120"></dxi-column>
            </dx-data-grid>
          </div>
          <div class="card section-card">
            <div class="sec-head">
              <span class="sec-icon">&#127909;</span>
              <h3>Assistidos</h3>
              <span class="sec-count">{{ user.watched.length }}</span>
            </div>
            <dx-data-grid [dataSource]="user.watched" [showBorders]="false" keyExpr="id" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Título"></dxi-column>
              <dxi-column dataField="movie.imdbId" caption="IMDb" [width]="120"></dxi-column>
            </dx-data-grid>
          </div>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: #6B7A99; font-size: 0.85rem; margin-bottom: 1.5rem; text-decoration: none; transition: color 0.15s; }
    .back-link:hover { color: #1D398C; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #6B7A99; font-size: 0.875rem; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(29,57,140,0.08); }
    .hero { display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem 1.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; border: 1px solid #EEF2FF; }
    .hero-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #1D398C, #65ECEC); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.5rem; flex-shrink: 0; }
    .hero-info { display: flex; flex-direction: column; gap: 0.4rem; }
    .hero-info h2 { margin: 0; font-size: 1.1rem; }
    .spacer { flex: 1; min-width: 1rem; }
    .stats { display: flex; align-items: center; gap: 1.5rem; }
    .stat { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
    .stat-num { font-size: 1.4rem; font-weight: 800; color: #1D398C; line-height: 1; }
    .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #98A2BE; font-weight: 600; }
    .stat-sep { width: 1px; height: 32px; background: #EEF2FF; }
    .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .badge-admin { background: #EAEFFF; color: #1D398C; }
    .badge-comum { background: rgba(210,224,3,0.15); color: #5A6B00; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 680px) { .grid-2 { grid-template-columns: 1fr; } }
    .section-card { overflow: hidden; border: 1px solid #EEF2FF; }
    .sec-head { display: flex; align-items: center; gap: 0.65rem; padding: 0.9rem 1.1rem; background: #FAFBFF; border-bottom: 1px solid #EEF2FF; }
    .sec-icon { font-size: 1rem; }
    .sec-head h3 { margin: 0; font-size: 0.9rem; font-weight: 700; color: #0F1A35; }
    .sec-count { margin-left: auto; background: #EAEFFF; color: #1D398C; font-size: 0.72rem; font-weight: 700; padding: 0.12rem 0.55rem; border-radius: 20px; }
    .msg-error { color: #D63939; font-size: 0.875rem; margin-top: 0.5rem; }
  `],
})
export class AdminUserDetailComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  readonly id = input.required<string>();
  user: UserDetail | null = null; loading = true; error = '';
  ngOnInit(): void {
    this.api.getUserDetail(this.id()).subscribe({
      next: (u) => { this.user = u; this.loading = false; },
      error: () => { this.error = 'Usuário não encontrado ou sem permissão.'; this.loading = false; },
    });
  }
}
