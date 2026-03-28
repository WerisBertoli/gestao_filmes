import { Component, OnInit, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { FavoriteRow, MovieApiService } from '../../core/movie-api.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [DxDataGridModule, DxLoadIndicatorModule],
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
          <div class="empty-icon">&#10084;</div>
          <p class="empty-title">Nenhum favorito ainda</p>
          <p class="empty-text">Busque filmes e clique em "Favoritar" para adicioná-los aqui.</p>
        </div>
      } @else {
        <div class="card grid-card">
          <dx-data-grid [dataSource]="rows" [showBorders]="false" [columnAutoWidth]="true" keyExpr="id" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
            <dxi-column dataField="movie.title" caption="Título"></dxi-column>
            <dxi-column dataField="movie.year" caption="Ano" [width]="90"></dxi-column>
            <dxi-column dataField="movie.imdbId" caption="IMDb ID" [width]="130"></dxi-column>
            <dxi-column dataField="createdAt" caption="Adicionado em" dataType="datetime" [width]="180"></dxi-column>
          </dx-data-grid>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #1a202c; letter-spacing: -0.02em; }
    .subtitle { font-size: 0.875rem; color: #718096; margin: 0; }
    .count-badge { background: #ebf4ff; color: #2b6cb0; font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.85rem; border-radius: 20px; align-self: center; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .grid-card { overflow: hidden; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #718096; font-size: 0.875rem; }
    .empty-state { padding: 3.5rem 2rem; text-align: center; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.35; }
    .empty-title { font-weight: 600; font-size: 1rem; color: #4a5568; margin: 0 0 0.5rem; }
    .empty-text { font-size: 0.875rem; color: #718096; margin: 0; }
    .msg-error { color: #e53e3e; font-size: 0.875rem; }
  `],
})
export class FavoritesComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  rows: FavoriteRow[] = []; loading = true; error = '';
  ngOnInit(): void {
    this.api.listFavorites().subscribe({
      next: (data) => { this.rows = data; this.loading = false; },
      error: () => { this.error = 'Não foi possível carregar favoritos.'; this.loading = false; },
    });
  }
}
