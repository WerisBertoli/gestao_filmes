import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, UserDetail } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, DxDataGridModule, DxLoadIndicatorModule],
  template: `
    <p><a routerLink="/app/admin/usuarios">← Voltar</a></p>
    @if (loading) {
      <dx-load-indicator [visible]="true" />
    } @else if (user) {
      <h2>Usuário: {{ user.email }}</h2>
      <p>
        <strong>ID:</strong> {{ user.id }} &nbsp;|&nbsp;
        <strong>Perfil:</strong> {{ user.role }} &nbsp;|&nbsp;
        <strong>Cadastro:</strong> {{ user.createdAt | date: 'short' }}
      </p>
      <h3>Favoritos</h3>
      <dx-data-grid
        [dataSource]="user.favorites"
        [showBorders]="true"
        keyExpr="id"
      >
        <dxi-column
          dataField="movie.title"
          caption="Título"
        ></dxi-column>
        <dxi-column
          dataField="movie.imdbId"
          caption="IMDb"
          [width]="120"
        ></dxi-column>
      </dx-data-grid>
      <h3 class="mt">Assistidos</h3>
      <dx-data-grid
        [dataSource]="user.watched"
        [showBorders]="true"
        keyExpr="id"
      >
        <dxi-column
          dataField="movie.title"
          caption="Título"
        ></dxi-column>
        <dxi-column
          dataField="movie.imdbId"
          caption="IMDb"
          [width]="120"
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
      .mt {
        margin-top: 1.5rem;
      }
    `,
  ],
})
export class AdminUserDetailComponent implements OnInit {
  private readonly api = inject(MovieApiService);

  readonly id = input.required<string>();

  user: UserDetail | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getUserDetail(this.id()).subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: () => {
        this.error = 'Usuário não encontrado ou sem permissão.';
        this.loading = false;
      },
    });
  }
}
