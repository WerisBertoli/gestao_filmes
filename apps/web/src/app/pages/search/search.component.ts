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
      <div class="search-card card">
        <div class="search-row">
          <dx-text-box [(value)]="title" placeholder="Digite o título do filme..." stylingMode="outlined" width="100%" (onEnterKey)="search()" />
          <dx-button text="Buscar" type="default" stylingMode="contained" [disabled]="loading" (onClick)="search()" />
        </div>
        @if (message) { <p class="search-msg">{{ message }}</p> }
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Buscando...</span></div>
      }
      @if (results.length) {
        <div class="results-grid">
          @for (r of results; track r.imdbID) {
            <div class="movie-card">
              <div class="poster-wrap">
                @if (r.Poster && r.Poster !== 'N/A') {
                  <img class="poster" [src]="r.Poster" [alt]="r.Title" />
                } @else {
                  <div class="poster-placeholder">&#127909;</div>
                }
                <span class="year-tag">{{ r.Year }}</span>
              </div>
              <div class="movie-body">
                <p class="movie-title">{{ r.Title }}</p>
                <span class="imdb-tag">{{ r.imdbID }}</span>
                <div class="movie-actions">
                  <button class="btn-action btn-fav" (click)="favorite(r)">&#9825; Favoritar</button>
                  <button class="btn-action btn-watch" (click)="watched(r)">&#10003; Assistido</button>
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
    .page-header { margin-bottom: 1.5rem; }
    h2 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.2rem; color: #0F1A35; letter-spacing: -0.025em; }
    .subtitle { font-size: 0.875rem; color: #6B7A99; margin: 0; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(29,57,140,0.08); }
    .search-card { padding: 1.25rem 1.5rem; margin-bottom: 1.75rem; }
    .search-row { display: flex; gap: 0.75rem; align-items: center; }
    .search-msg { margin: 0.75rem 0 0; font-size: 0.85rem; color: #6B7A99; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 1.5rem 0; color: #6B7A99; font-size: 0.875rem; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .movie-card { background: #fff; border-radius: 16px; box-shadow: 0 3px 16px rgba(29,57,140,0.08); overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s; border: 1px solid #EEF2FF; }
    .movie-card:hover { box-shadow: 0 10px 30px rgba(29,57,140,0.15); transform: translateY(-3px); border-color: #C7D0F8; }
    .poster-wrap { position: relative; }
    .poster { width: 100%; height: 220px; object-fit: cover; display: block; }
    .poster-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, #EAEFFF, #DDE6FF); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .year-tag { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.65); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 20px; backdrop-filter: blur(4px); }
    .movie-body { padding: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .movie-title { font-weight: 700; font-size: 0.9rem; color: #0F1A35; margin: 0; line-height: 1.35; flex: 1; }
    .imdb-tag { font-size: 0.72rem; color: #98A2BE; font-family: monospace; }
    .movie-actions { display: flex; gap: 0.5rem; margin-top: 0.35rem; }
    .btn-action { flex: 1; border: none; border-radius: 8px; padding: 0.45rem 0.5rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
    .btn-fav { background: #EAEFFF; color: #1D398C; }
    .btn-fav:hover { background: #1D398C; color: #fff; }
    .btn-watch { background: rgba(210,224,3,0.15); color: #5A6B00; }
    .btn-watch:hover { background: #D2E003; color: #0F1A35; }
  `],
})
export class SearchComponent {
  private readonly api = inject(MovieApiService);
  title = ''; results: OmdbSearchItem[] = []; loading = false; message = '';
  search(): void {
    this.message = ''; this.results = []; this.loading = true;
    this.api.searchMovies(this.title.trim()).subscribe({
      next: (res) => { this.results = res.results ?? []; this.message = this.results.length === 0 ? 'Nenhum resultado encontrado.' : res.total + ' resultado(s) encontrado(s).'; },
      error: (err: { status?: number; error?: { message?: string } }) => { this.message = err?.error?.message ?? (err.status === 503 ? 'Serviço OMDb indisponível.' : 'Erro ao buscar.'); },
      complete: () => { this.loading = false; },
    });
  }
  favorite(row: OmdbSearchItem): void {
    this.api.addFavorite(row.imdbID).subscribe({
      next: () => { this.message = '"' + row.Title + '" adicionado aos favoritos.'; },
      error: (err: { error?: { message?: string | string[] } }) => { const m = err?.error?.message; this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro'); },
    });
  }
  watched(row: OmdbSearchItem): void {
    this.api.markWatched(row.imdbID).subscribe({
      next: () => { this.message = '"' + row.Title + '" marcado como assistido.'; },
      error: (err: { error?: { message?: string | string[] } }) => { const m = err?.error?.message; this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro'); },
    });
  }
}
