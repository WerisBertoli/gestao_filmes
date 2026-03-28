import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { MovieApiService, OmdbSearchItem } from '../../core/movie-api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, DxTextBoxModule, DxButtonModule, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Buscar Filmes</h2>
          <p class="subtitle">Pesquise no catálogo OMDb e gerencie sua lista</p>
        </div>
      </div>
      <div class="card search-bar">
        <div class="search-row">
          <dx-text-box [(value)]="title" placeholder="Digite o título do filme..." stylingMode="outlined" width="100%" (onEnterKey)="search()" />
          <dx-button text="Buscar" type="default" stylingMode="contained" [disabled]="loading" (onClick)="search()" />
        </div>
        @if (message) { <p class="search-info">{{ message }}</p> }
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Buscando filmes...</span></div>
      }
      @if (results.length) {
        <div class="results-grid">
          @for (r of results; track r.imdbID) {
            <div class="movie-card">
              @if (r.Poster && r.Poster !== 'N/A') {
                <img class="movie-poster" [src]="r.Poster" [alt]="r.Title" />
              } @else {
                <div class="movie-poster-placeholder">&#127909;</div>
              }
              <div class="movie-info">
                <p class="movie-title">{{ r.Title }}</p>
                <div class="movie-meta">
                  <span class="year-badge">{{ r.Year }}</span>
                  <span class="imdb-id">{{ r.imdbID }}</span>
                </div>
                <div class="movie-actions">
                  <dx-button text="Favoritar" stylingMode="contained" type="default" [height]="30" (onClick)="favorite(r)" />
                  <dx-button text="Assistido" stylingMode="outlined" type="default" [height]="30" (onClick)="watched(r)" />
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 1.25rem; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #1a202c; letter-spacing: -0.02em; }
    .subtitle { font-size: 0.875rem; color: #718096; margin: 0; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 1.25rem 1.5rem; }
    .search-bar { margin-bottom: 1.5rem; }
    .search-row { display: flex; gap: 0.75rem; align-items: center; }
    .search-info { margin: 0.75rem 0 0; font-size: 0.875rem; color: #718096; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #718096; font-size: 0.875rem; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .movie-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden; display: flex; flex-direction: column; transition: box-shadow 0.2s, transform 0.2s; }
    .movie-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.13); transform: translateY(-2px); }
    .movie-poster { width: 100%; height: 200px; object-fit: cover; }
    .movie-poster-placeholder { width: 100%; height: 160px; background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .movie-info { padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .movie-title { font-weight: 600; font-size: 0.95rem; color: #1a202c; margin: 0; line-height: 1.35; }
    .movie-meta { display: flex; align-items: center; gap: 0.5rem; }
    .year-badge { background: #ebf4ff; color: #2b6cb0; font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.55rem; border-radius: 20px; }
    .imdb-id { font-size: 0.78rem; color: #a0aec0; font-family: monospace; }
    .movie-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
  `],
})
export class SearchComponent {
  private readonly api = inject(MovieApiService);
  title = ''; results: OmdbSearchItem[] = []; loading = false; message = '';
  search(): void {
    this.message = ''; this.results = []; this.loading = true;
    this.api.searchMovies(this.title.trim()).subscribe({
      next: (res) => {
        this.results = res.results ?? [];
        this.message = this.results.length === 0 ? 'Nenhum resultado encontrado.' : `${res.total} resultado(s) encontrado(s).`;
      },
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.message = err?.error?.message ?? (err.status === 503 ? 'Serviço OMDb temporariamente indisponível.' : 'Erro ao buscar filmes.');
      },
      complete: () => { this.loading = false; },
    });
  }
  favorite(row: OmdbSearchItem): void {
    this.api.addFavorite(row.imdbID).subscribe({
      next: () => { this.message = '"' + row.Title + '" adicionado aos favoritos.'; },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
      },
    });
  }
  watched(row: OmdbSearchItem): void {
    this.api.markWatched(row.imdbID).subscribe({
      next: () => { this.message = '"' + row.Title + '" marcado como assistido.'; },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
      },
    });
  }
}
