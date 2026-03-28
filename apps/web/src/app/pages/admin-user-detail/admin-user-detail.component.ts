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
        <div class="user-hero card">
          <div class="user-avatar">{{ user.email[0].toUpperCase() }}</div>
          <div class="user-info">
            <h2>{{ user.email }}</h2>
            @if (user.role === 'ADMIN') {
              <span class="chip chip-admin">Admin</span>
            } @else {
              <span class="chip chip-comum">Comum</span>
            }
          </div>
          <div class="spacer"></div>
          <div class="user-meta">
            <div class="meta-item">
              <span class="meta-label">Cadastrado em</span>
              <span class="meta-value">{{ user.createdAt | date: 'dd/MM/yyyy' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Favoritos</span>
              <span class="meta-value">{{ user.favorites.length }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Assistidos</span>
              <span class="meta-value">{{ user.watched.length }}</span>
            </div>
          </div>
        </div>
        <div class="sections-grid">
          <div class="card section-card">
            <div class="section-header">
              <span class="section-icon">&#10084;</span>
              <h3>Favoritos</h3>
              <span class="count">{{ user.favorites.length }}</span>
            </div>
            <dx-data-grid [dataSource]="user.favorites" [showBorders]="false" keyExpr="id" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Título"></dxi-column>
              <dxi-column dataField="movie.imdbId" caption="IMDb ID" [width]="130"></dxi-column>
            </dx-data-grid>
          </div>
          <div class="card section-card">
            <div class="section-header">
              <span class="section-icon">&#10003;</span>
              <h3>Assistidos</h3>
              <span class="count">{{ user.watched.length }}</span>
            </div>
            <dx-data-grid [dataSource]="user.watched" [showBorders]="false" keyExpr="id" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Título"></dxi-column>
              <dxi-column dataField="movie.imdbId" caption="IMDb ID" [width]="130"></dxi-column>
            </dx-data-grid>
          </div>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .back-link { display: inline-flex; align-items: center; gap: 0.35rem; color: #718096; font-size: 0.875rem; margin-bottom: 1.5rem; text-decoration: none; transition: color 0.15s; }
    .back-link:hover { color: #3b82f6; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #718096; font-size: 0.875rem; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .user-hero { display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .user-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.4rem; flex-shrink: 0; }
    .user-info { display: flex; flex-direction: column; gap: 0.4rem; }
    .user-info h2 { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .spacer { flex: 1; }
    .user-meta { display: flex; gap: 2rem; flex-wrap: wrap; }
    .meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .meta-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #718096; font-weight: 600; }
    .meta-value { font-size: 1rem; font-weight: 700; color: #1a202c; }
    .chip { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    .chip-admin { background: #ebf4ff; color: #2b6cb0; }
    .chip-comum { background: #f0fff4; color: #276749; }
    .sections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .section-card { overflow: hidden; }
    .section-header { display: flex; align-items: center; gap: 0.65rem; padding: 1rem 1.25rem; border-bottom: 1px solid #f0f4f8; background: #fafbfc; }
    .section-icon { font-size: 1.1rem; }
    .section-header h3 { margin: 0; font-size: 0.95rem; font-weight: 600; }
    .count { margin-left: auto; background: #ebf4ff; color: #2b6cb0; font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.55rem; border-radius: 20px; }
    .msg-error { color: #e53e3e; font-size: 0.875rem; }
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
