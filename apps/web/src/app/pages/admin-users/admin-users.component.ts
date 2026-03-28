import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { MovieApiService, UserListItem } from '../../core/movie-api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, DxLoadIndicatorModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Usuários</h2>
          <p class="subtitle">Gerencie e visualize todos os usuários cadastrados</p>
        </div>
        @if (!loading) { <span class="count-badge">{{ users.length }} usuário(s)</span> }
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando usuários...</span></div>
      } @else {
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Cadastrado em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (u of users; track u.id) {
                <tr>
                  <td class="email-cell">
                    <div class="avatar">{{ u.email[0].toUpperCase() }}</div>
                    {{ u.email }}
                  </td>
                  <td>
                    @if (u.role === 'ADMIN') {
                      <span class="chip chip-admin">Admin</span>
                    } @else {
                      <span class="chip chip-comum">Comum</span>
                    }
                  </td>
                  <td class="date-cell">{{ u.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td class="action-cell">
                    <button class="btn-detail" (click)="open(u)">Ver detalhes</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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
    .count-badge { background: #faf5ff; color: #6b46c1; font-size: 0.8rem; font-weight: 600; padding: 0.3rem 0.85rem; border-radius: 20px; align-self: center; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #718096; font-size: 0.875rem; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead tr { border-bottom: 2px solid #f0f4f8; }
    .table th { padding: 0.85rem 1.25rem; text-align: left; font-size: 0.72rem; font-weight: 700; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; background: #fafbfc; }
    .table td { padding: 0.9rem 1.25rem; font-size: 0.875rem; color: #1a202c; border-bottom: 1px solid #f0f4f8; }
    .table tbody tr:hover { background: #fafbff; }
    .table tbody tr:last-child td { border-bottom: none; }
    .email-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
    .chip { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    .chip-admin { background: #ebf4ff; color: #2b6cb0; }
    .chip-comum { background: #f0fff4; color: #276749; }
    .date-cell { color: #718096; font-size: 0.825rem; }
    .action-cell { text-align: right; }
    .btn-detail { background: none; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.35rem 0.85rem; font-size: 0.8rem; font-weight: 500; color: #3b82f6; cursor: pointer; transition: all 0.15s; font-family: inherit; }
    .btn-detail:hover { background: #ebf4ff; border-color: #3b82f6; }
    .msg-error { color: #e53e3e; font-size: 0.875rem; }
  `],
})
export class AdminUsersComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  private readonly router = inject(Router);
  users: UserListItem[] = []; loading = true; error = '';
  ngOnInit(): void {
    this.api.listUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.error = 'Não foi possível listar usuários.'; this.loading = false; },
    });
  }
  open(u: UserListItem): void { void this.router.navigate(['/app/admin/usuarios', u.id]); }
}
