import { Component, OnInit, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, RankingRow } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-rankings',
  standalone: true,
  imports: [DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Rankings</h2>
          <p class="subtitle">Filmes mais populares entre os usuários</p>
        </div>
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando rankings...</span></div>
      } @else {
        <div class="rankings-grid">
          <div class="card rank-card">
            <div class="rank-header favorites-header">
              <span class="rank-icon">&#10084;</span>
              <div>
                <h3>Mais Favoritados</h3>
                <p class="rank-subtitle">{{ favoritesRank.length }} filme(s)</p>
              </div>
            </div>
            <dx-data-grid [dataSource]="favoritesRank" [showBorders]="false" keyExpr="movie.imdbId" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Filme"></dxi-column>
              <dxi-column dataField="count" caption="Favoritos" [width]="110" alignment="center"></dxi-column>
            </dx-data-grid>
          </div>
          <div class="card rank-card">
            <div class="rank-header watched-header">
              <span class="rank-icon">&#10003;</span>
              <div>
                <h3>Mais Assistidos</h3>
                <p class="rank-subtitle">{{ watchedRank.length }} filme(s)</p>
              </div>
            </div>
            <dx-data-grid [dataSource]="watchedRank" [showBorders]="false" keyExpr="movie.imdbId" [rowAlternationEnabled]="true" [hoverStateEnabled]="true">
              <dxi-column dataField="movie.title" caption="Filme"></dxi-column>
              <dxi-column dataField="count" caption="Assistidos" [width]="110" alignment="center"></dxi-column>
            </dx-data-grid>
          </div>
        </div>
      }
      @if (error) { <p class="msg-error">{{ error }}</p> }
    </div>
  `,
  styles: [`
    .page { padding: 1.75rem 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #1a202c; letter-spacing: -0.02em; }
    h3 { font-size: 1rem; font-weight: 600; margin: 0; color: #1a202c; }
    .subtitle { font-size: 0.875rem; color: #718096; margin: 0; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #718096; font-size: 0.875rem; }
    .rankings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
    .rank-card { display: flex; flex-direction: column; }
    .rank-header { display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem; }
    .favorites-header { background: linear-gradient(135deg, #fff5f5, #fed7d7); border-bottom: 1px solid #feb2b2; }
    .watched-header { background: linear-gradient(135deg, #f0fff4, #c6f6d5); border-bottom: 1px solid #9ae6b4; }
    .rank-icon { font-size: 1.75rem; }
    .rank-subtitle { font-size: 0.78rem; color: #718096; margin: 0.15rem 0 0; }
    .msg-error { color: #e53e3e; font-size: 0.875rem; }
  `],
})
export class AdminRankingsComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  favoritesRank: RankingRow[] = []; watchedRank: RankingRow[] = []; loading = true; error = '';
  ngOnInit(): void {
    let pending = 2;
    const done = (): void => { pending -= 1; if (pending === 0) this.loading = false; };
    this.api.rankingFavorites().subscribe({
      next: (r) => { this.favoritesRank = r.filter((x) => x.movie); done(); },
      error: () => { this.error = 'Erro ao carregar rankings.'; done(); },
    });
    this.api.rankingWatched().subscribe({
      next: (r) => { this.watchedRank = r.filter((x) => x.movie); done(); },
      error: () => { this.error = 'Erro ao carregar rankings.'; done(); },
    });
  }
}
