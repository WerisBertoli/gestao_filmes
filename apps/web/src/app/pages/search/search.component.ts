import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { forkJoin } from 'rxjs';
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
          <div class="search-field">
            <dx-text-box [(value)]="title" placeholder="Digite o título do filme..." stylingMode="outlined" width="100%" (onEnterKey)="search()" />
          </div>
          <div class="search-btn-wrap">
            <dx-button text="Buscar" type="default" stylingMode="contained" [disabled]="loading" [width]="124" [height]="38" (onClick)="search()" />
          </div>
        </div>
        @if (message) { <p class="search-msg" [class.msg-ok]="msgOk" [class.msg-err]="!msgOk">{{ message }}</p> }
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
                @if (isFav(r.imdbID) && isWatched(r.imdbID)) {
                  <span class="status-badge badge-both">&#9825; Assistido</span>
                } @else if (isFav(r.imdbID)) {
                  <span class="status-badge badge-fav">&#9825; Favorito</span>
                } @else if (isWatched(r.imdbID)) {
                  <span class="status-badge badge-watch">&#10003; Assistido</span>
                }
              </div>
              <div class="movie-body">
                <p class="movie-title">{{ r.Title }}</p>
                <span class="imdb-tag">{{ r.imdbID }}</span>
                <div class="movie-actions">
                  <button
                    class="btn-action btn-fav"
                    [class.btn-done]="isFav(r.imdbID)"
                    [disabled]="isFav(r.imdbID)"
                    (click)="favorite(r)">
                    {{ isFav(r.imdbID) ? '&#9829; Favoritado' : '&#9825; Favoritar' }}
                  </button>
                  <button
                    class="btn-action btn-watch"
                    [class.btn-done]="isWatched(r.imdbID)"
                    [disabled]="isWatched(r.imdbID)"
                    (click)="watched(r)">
                    {{ isWatched(r.imdbID) ? '&#10003; Assistido' : '&#10003; Assistido?' }}
                  </button>
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
    .search-row { display: flex; gap: 0.85rem; align-items: stretch; }
    .search-field { flex: 1; min-width: 0; }
    .search-field ::ng-deep .dx-texteditor { width: 100% !important; max-width: 100%; }
    .search-btn-wrap { flex-shrink: 0; display: flex; align-items: center; align-self: center; }
    .search-btn-wrap ::ng-deep .dx-button { min-width: 7.75rem; }
    .search-btn-wrap ::ng-deep .dx-button-content { padding-left: 1.1rem; padding-right: 1.1rem; }
    .search-msg { margin: 0.75rem 0 0; font-size: 0.85rem; color: #6B7A99; padding: 0.5rem 0.75rem; border-radius: 8px; background: #F4F7FC; }
    .msg-ok { color: #1E9E5E; background: #EDFBF4; }
    .msg-err { color: #D63939; background: #FEF1F1; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 1.5rem 0; color: #6B7A99; font-size: 0.875rem; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .movie-card { background: #fff; border-radius: 16px; box-shadow: 0 3px 16px rgba(29,57,140,0.08); overflow: hidden; display: flex; flex-direction: column; transition: all 0.2s; border: 1px solid #EEF2FF; }
    .movie-card:hover { box-shadow: 0 10px 30px rgba(29,57,140,0.15); transform: translateY(-3px); border-color: #C7D0F8; }
    .poster-wrap { position: relative; }
    .poster { width: 100%; height: 220px; object-fit: cover; display: block; }
    .poster-placeholder { width: 100%; height: 180px; background: linear-gradient(135deg, #EAEFFF, #DDE6FF); display: flex; align-items: center; justify-content: center; font-size: 3rem; }
    .year-tag { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.65); color: #fff; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 20px; backdrop-filter: blur(4px); }
    .status-badge { position: absolute; bottom: 0.5rem; left: 0.5rem; font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 20px; }
    .badge-fav { background: rgba(29,57,140,0.85); color: #fff; }
    .badge-watch { background: rgba(210,224,3,0.9); color: #0F1A35; }
    .badge-both { background: rgba(29,57,140,0.85); color: #D2E003; }
    .movie-body { padding: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .movie-title { font-weight: 700; font-size: 0.9rem; color: #0F1A35; margin: 0; line-height: 1.35; flex: 1; }
    .imdb-tag { font-size: 0.72rem; color: #98A2BE; font-family: monospace; }
    .movie-actions { display: flex; gap: 0.5rem; margin-top: 0.35rem; }
    .btn-action { flex: 1; border: none; border-radius: 8px; padding: 0.45rem 0.5rem; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
    .btn-fav { background: #EAEFFF; color: #1D398C; }
    .btn-fav:hover:not(:disabled) { background: #1D398C; color: #fff; }
    .btn-watch { background: rgba(210,224,3,0.15); color: #5A6B00; }
    .btn-watch:hover:not(:disabled) { background: #D2E003; color: #0F1A35; }
    .btn-done { opacity: 0.6; cursor: not-allowed !important; }
    button:disabled { cursor: not-allowed; }
  `],
})
export class SearchComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  title = '';
  results: OmdbSearchItem[] = [];
  loading = false;
  message = '';
  msgOk = false;
  favSet = new Set<string>();
  watchedSet = new Set<string>();

  ngOnInit(): void {
    forkJoin({ favs: this.api.listFavorites(), watched: this.api.listWatched() }).subscribe({
      next: ({ favs, watched }) => {
        this.favSet = new Set(favs.map(f => f.movie.imdbId));
        this.watchedSet = new Set(watched.map(w => w.movie.imdbId));
      },
    });
  }

  isFav(id: string): boolean { return this.favSet.has(id); }
  isWatched(id: string): boolean { return this.watchedSet.has(id); }

  search(): void {
    this.message = ''; this.results = []; this.loading = true; this.msgOk = false;
    this.api.searchMovies(this.title.trim()).subscribe({
      next: (res) => {
        this.results = res.results ?? [];
        this.msgOk = this.results.length > 0;
        this.message = this.results.length === 0 ? 'Nenhum resultado encontrado.' : res.total + ' resultado(s) encontrado(s).';
      },
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.message = err?.error?.message ?? (err.status === 503 ? 'Serviço OMDb indisponível.' : 'Erro ao buscar.');
      },
      complete: () => { this.loading = false; },
    });
  }

  favorite(row: OmdbSearchItem): void {
    this.api.addFavorite(row.imdbID).subscribe({
      next: () => {
        this.favSet.add(row.imdbID);
        this.message = '"' + row.Title + '" adicionado aos favoritos.';
        this.msgOk = true;
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
        this.msgOk = false;
      },
    });
  }

  watched(row: OmdbSearchItem): void {
    this.api.markWatched(row.imdbID).subscribe({
      next: () => {
        this.watchedSet.add(row.imdbID);
        this.message = '"' + row.Title + '" marcado como assistido.';
        this.msgOk = true;
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
        this.msgOk = false;
      },
    });
  }
}
