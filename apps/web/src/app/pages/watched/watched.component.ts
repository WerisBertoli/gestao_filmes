import { Component, OnInit, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, WatchedRow } from '../../core/movie-api.service';

@Component({
  selector: 'app-watched',
  standalone: true,
  imports: [DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <h2>Filmes assistidos</h2>
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
          caption="Marcado em"
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
export class WatchedComponent implements OnInit {
  private readonly api = inject(MovieApiService);

  rows: WatchedRow[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.listWatched().subscribe({
      next: (data) => {
        this.rows = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível carregar assistidos.';
        this.loading = false;
      },
    });
  }
}
