import { Component, OnInit, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { FavoriteRow, MovieApiService } from '../../core/movie-api.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <h2>Meus favoritos</h2>
    @if (loading) {
      <dx-load-indicator [visible]="true" />
    } @else {
      <dx-data-grid
        [dataSource]="rows"
        [showBorders]="true"
        [columnAutoWidth]="true"
        keyExpr="id"
      >
        <dxi-column
          dataField="movie.title"
          caption="Título"
        ></dxi-column>
        <dxi-column
          dataField="movie.year"
          caption="Ano"
          [width]="90"
        ></dxi-column>
        <dxi-column
          dataField="movie.imdbId"
          caption="IMDb"
          [width]="120"
        ></dxi-column>
        <dxi-column
          dataField="createdAt"
          caption="Adicionado em"
          dataType="datetime"
        ></dxi-column>
      </dx-data-grid>
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
    `,
  ],
})
export class FavoritesComponent implements OnInit {
  private readonly api = inject(MovieApiService);

  rows: FavoriteRow[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.listFavorites().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar favoritos.';
        this.loading = false;
      },
    });
  }
}
