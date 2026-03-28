import { Component, OnInit, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, RankingRow } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-rankings',
  standalone: true,
  imports: [DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <h2>Rankings (admin)</h2>
    @if (loading) {
      <dx-load-indicator [visible]="true" />
    } @else {
      <section>
        <h3>Mais favoritados</h3>
        <dx-data-grid
          [dataSource]="favoritesRank"
          [showBorders]="true"
          keyExpr="movie.imdbId"
        >
          <dxi-column dataField="movie.title" caption="Filme"></dxi-column>
          <dxi-column
            dataField="count"
            caption="Favoritos"
            [width]="100"
          ></dxi-column>
        </dx-data-grid>
      </section>
      <section class="mt">
        <h3>Mais assistidos</h3>
        <dx-data-grid
          [dataSource]="watchedRank"
          [showBorders]="true"
          keyExpr="movie.imdbId"
        >
          <dxi-column dataField="movie.title" caption="Filme"></dxi-column>
          <dxi-column
            dataField="count"
            caption="Assistidos"
            [width]="100"
          ></dxi-column>
        </dx-data-grid>
      </section>
    }
    @if (error) {
      <p class="err">{{ error }}</p>
    }
  `,
  styles: [
    `
      .err {
        color: #c62828;
      }
      .mt {
        margin-top: 2rem;
      }
    `,
  ],
})
export class AdminRankingsComponent implements OnInit {
  private readonly api = inject(MovieApiService);

  favoritesRank: RankingRow[] = [];
  watchedRank: RankingRow[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    let pending = 2;
    const done = (): void => {
      pending -= 1;
      if (pending === 0) {
        this.loading = false;
      }
    };
    this.api.rankingFavorites().subscribe({
      next: (r) => {
        this.favoritesRank = r.filter((x) => x.movie);
        done();
      },
      error: () => {
        this.error = 'Erro ao carregar rankings.';
        done();
      },
    });
    this.api.rankingWatched().subscribe({
      next: (r) => {
        this.watchedRank = r.filter((x) => x.movie);
        done();
      },
      error: () => {
        this.error = 'Erro ao carregar rankings.';
        done();
      },
    });
  }
}
