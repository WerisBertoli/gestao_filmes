import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import {
  MovieApiService,
  OmdbSearchItem,
} from '../../core/movie-api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, DxTextBoxModule, DxButtonModule, DxLoadIndicatorModule],
  template: `
    <h2>Buscar filmes (OMDb)</h2>
    <div class="row">
      <dx-text-box
        [(value)]="title"
        placeholder="Título do filme"
        width="280"
        (onEnterKey)="search()"
      />
      <dx-button
        text="Buscar"
        type="default"
        stylingMode="contained"
        [disabled]="loading"
        (onClick)="search()"
      />
    </div>
    @if (loading) {
      <dx-load-indicator [visible]="true" />
    }
    @if (message) {
      <p class="msg">{{ message }}</p>
    }
    @if (results.length) {
      <div class="table-wrap dx-card">
        <table class="grid">
          <thead>
            <tr>
              <th>Título</th>
              <th>Ano</th>
              <th>IMDb</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (r of results; track r.imdbID) {
              <tr>
                <td>{{ r.Title }}</td>
                <td>{{ r.Year }}</td>
                <td>{{ r.imdbID }}</td>
                <td class="actions">
                  <dx-button
                    text="Favoritar"
                    stylingMode="contained"
                    type="default"
                    [height]="28"
                    (onClick)="favorite(r)"
                  />
                  <dx-button
                    text="Assistido"
                    stylingMode="outlined"
                    type="default"
                    [height]="28"
                    (onClick)="watched(r)"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [
    `
      .row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .msg {
        color: #666;
      }
      .table-wrap {
        margin-top: 1rem;
        overflow: auto;
      }
      .grid {
        width: 100%;
        border-collapse: collapse;
      }
      .grid th,
      .grid td {
        border: 1px solid #e0e0e0;
        padding: 0.5rem 0.75rem;
        text-align: left;
      }
      .grid th {
        background: #f5f5f5;
      }
      .actions {
        white-space: nowrap;
      }
      .actions dx-button {
        margin-right: 0.35rem;
      }
    `,
  ],
})
export class SearchComponent {
  private readonly api = inject(MovieApiService);

  title = '';
  results: OmdbSearchItem[] = [];
  loading = false;
  message = '';

  search(): void {
    this.message = '';
    this.results = [];
    this.loading = true;
    this.api.searchMovies(this.title.trim()).subscribe({
      next: (res) => {
        this.results = res.results ?? [];
        this.message =
          this.results.length === 0
            ? 'Nenhum resultado. Tente outro título.'
            : `${res.total} resultado(s) (lista retornada pela OMDb).`;
      },
      error: (err: { status?: number; error?: { message?: string } }) => {
        this.message =
          err?.error?.message ??
          (err.status === 503
            ? 'Serviço OMDb temporariamente indisponível.'
            : 'Erro ao buscar filmes.');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  favorite(row: OmdbSearchItem): void {
    this.api.addFavorite(row.imdbID).subscribe({
      next: () => {
        this.message = `“${row.Title}” adicionado aos favoritos.`;
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
      },
    });
  }

  watched(row: OmdbSearchItem): void {
    this.api.markWatched(row.imdbID).subscribe({
      next: () => {
        this.message = `“${row.Title}” marcado como assistido.`;
      },
      error: (err: { error?: { message?: string | string[] } }) => {
        const m = err?.error?.message;
        this.message = Array.isArray(m) ? m.join(', ') : (m ?? 'Erro');
      },
    });
  }
}
