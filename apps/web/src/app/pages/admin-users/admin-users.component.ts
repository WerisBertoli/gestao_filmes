import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, UserListItem } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, DxLoadIndicatorModule, DxButtonModule],
  template: `
    <h2>Usuários (admin)</h2>
    @if (loading) {
      <dx-load-indicator [visible]="true" />
    } @else {
      <div class="table-wrap dx-card">
        <table class="grid">
          <thead>
            <tr>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users; track u.id) {
              <tr>
                <td>{{ u.email }}</td>
                <td>{{ u.role }}</td>
                <td>{{ u.createdAt | date: 'short' }}</td>
                <td>
                  <dx-button
                    text="Detalhes"
                    stylingMode="contained"
                    type="default"
                    [height]="26"
                    (onClick)="open(u)"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
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
    `,
  ],
})
export class AdminUsersComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  private readonly router = inject(Router);

  users: UserListItem[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.listUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Não foi possível listar usuários.';
        this.loading = false;
      },
    });
  }

  open(u: UserListItem): void {
    void this.router.navigate(['/app/admin/usuarios', u.id]);
  }
}
