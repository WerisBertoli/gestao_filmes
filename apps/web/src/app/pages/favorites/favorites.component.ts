import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { FavoriteRow, MovieApiService } from '../../core/movie-api.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [DatePipe, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Meus Favoritos</h2>
          <p class="subtitle">Filmes que você salvou como favorito</p>
        </div>
        @if (!loading) { <span class="count-badge">{{ rows.length }} filme(s)</span> }
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando...</span></div>
      } @else if (rows.length === 0) {
        <div class="card empty-state">
          <div class="empty-icon">&#9825;</div>
          <p class="empty-title">Nenhum favorito ainda</p>
          <p class="empty-text">Busque um filme e clique em "Favoritar".</p>
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
              @for (r of rows; track r.id) {
                <tr>
                  <td class="td-poster">
                    @if (r.movie.poster && r.movie.poster !== 'N/A') {
                      <img class="mini-poster" [src]="r.movie.poster" [alt]="r.movie.title" />
                    } @else {
                      <div class="mini-poster-ph">&#127909;</div>
                    }
                  </td>
                  <td class="td-title">{{ r.movie.title }}</td>
                  <td class="td-center"><span class="year-chip">{{ r.movie.year }}</span></td>
                  <td class="td-mono">{{ r.movie.imdbId }}</td>
                  <td class="td-muted">{{ r.createdAt | date: 'dd/MM/yyyy' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
    h2 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.2rem; color: #0F1A35; letter-spacing: -0.025em; }
    .subtitle { font-size: 0.875rem; color: #6B7A99; margin: 0; }
    .count-badge { background: #EAEFFF; color: #1D398C; font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.9rem; border-radius: 20px; align-self: center; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(29,57,140,0.08); }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #6B7A99; font-size: 0.875rem; }
    .empty-state { padding: 4rem 2rem; text-align: center; }
    .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4; }
    .empty-title { font-weight: 700; font-size: 1rem; color: #3A4A6B; margin: 0 0 0.4rem; }
    .empty-text { font-size: 0.875rem; color: #6B7A99; margin: 0; }
    .table-card { overflow: hidden; border: 1px solid #EEF2FF; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead { border-bottom: 2px solid #EEF2FF; }
    .table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.7rem; font-weight: 700; color: #98A2BE; text-transform: uppercase; letter-spacing: 0.06em; background: #FAFBFF; }
    .th-poster { width: 60px; }
    .table td { padding: 0.6rem 1rem; border-bottom: 1px solid #F3F5FC; vertical-align: middle; }
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr:hover td { background: #F7F9FF; }
    .td-poster { width: 60px; padding: 0.4rem 0.5rem 0.4rem 1rem; }
    .mini-poster { width: 40px; height: 56px; object-fit: cover; border-radius: 6px; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .mini-poster-ph { width: 40px; height: 56px; border-radius: 6px; background: linear-gradient(135deg, #EAEFFF, #DDE6FF); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .td-title { font-weight: 600; font-size: 0.875rem; color: #0F1A35; }
    .td-center { text-align: center; }
    .year-chip { background: #EAEFFF; color: #1D398C; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.55rem; border-radius: 20px; }
    .td-mono { font-family: monospace; font-size: 0.82rem; color: #6B7A99; }
    .td-muted { font-size: 0.82rem; color: #98A2BE; }
    .msg-error { color: #D63939; font-size: 0.875rem; margin-top: 0.5rem; }
  `],
})
export class FavoritesComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  rows: FavoriteRow[] = []; loading = true; error = '';
  ngOnInit(): void {
    this.api.listFavorites().subscribe({
      next: (d) => { this.rows = d; this.loading = false; },
      error: () => { this.error = 'Não foi possível carregar favoritos.'; this.loading = false; },
    });
  }
}
