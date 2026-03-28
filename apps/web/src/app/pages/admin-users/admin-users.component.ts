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
          <p class="subtitle">Todos os usuários cadastrados na plataforma</p>
        </div>
        @if (!loading) { <span class="count-badge">{{ users.length }} usuário(s)</span> }
      </div>
      @if (loading) {
        <div class="loading-wrap"><dx-load-indicator [visible]="true" /><span>Carregando...</span></div>
      } @else {
        <div class="card table-card">
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
                  <td>
                    <div class="user-cell">
                      <div class="avatar">{{ u.email[0].toUpperCase() }}</div>
                      <span>{{ u.email }}</span>
                    </div>
                  </td>
                  <td>
                    @if (u.role === 'ADMIN') {
                      <span class="badge badge-admin">Admin</span>
                    } @else {
                      <span class="badge badge-comum">Comum</span>
                    }
                  </td>
                  <td class="muted">{{ u.createdAt | date: 'dd/MM/yyyy' }}</td>
                  <td><button class="btn-detail" (click)="open(u)">Detalhes &#8594;</button></td>
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
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
    h2 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.2rem; color: #0F1A35; letter-spacing: -0.025em; }
    .subtitle { font-size: 0.875rem; color: #6B7A99; margin: 0; }
    .count-badge { background: #EAEFFF; color: #1D398C; font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.9rem; border-radius: 20px; align-self: center; }
    .loading-wrap { display: flex; align-items: center; gap: 0.75rem; padding: 2rem; color: #6B7A99; font-size: 0.875rem; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(29,57,140,0.08); }
    .table-card { overflow: hidden; border: 1px solid #EEF2FF; }
    .table { width: 100%; border-collapse: collapse; }
    .table thead { border-bottom: 2px solid #EEF2FF; }
    .table th { padding: 0.85rem 1.25rem; text-align: left; font-size: 0.7rem; font-weight: 700; color: #98A2BE; text-transform: uppercase; letter-spacing: 0.06em; background: #FAFBFF; }
    .table td { padding: 0.9rem 1.25rem; font-size: 0.875rem; color: #0F1A35; border-bottom: 1px solid #F3F5FC; }
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr:hover td { background: #F7F9FF; }
    .user-cell { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #1D398C, #65ECEC); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; flex-shrink: 0; }
    .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
    .badge-admin { background: #EAEFFF; color: #1D398C; }
    .badge-comum { background: rgba(210,224,3,0.15); color: #5A6B00; }
    .muted { color: #6B7A99; font-size: 0.825rem; }
    .btn-detail { background: none; border: 1px solid #DDE3F0; border-radius: 8px; padding: 0.35rem 0.85rem; font-size: 0.8rem; font-weight: 600; color: #1D398C; cursor: pointer; transition: all 0.15s; font-family: inherit; white-space: nowrap; }
    .btn-detail:hover { background: #EAEFFF; border-color: #1D398C; }
    .msg-error { color: #D63939; font-size: 0.875rem; margin-top: 0.5rem; }
  `],
})
export class AdminUsersComponent implements OnInit {
  private readonly api = inject(MovieApiService);
  private readonly router = inject(Router);
  users: UserListItem[] = []; loading = true; error = '';
  ngOnInit(): void {
    this.api.listUsers().subscribe({
      next: (d) => { this.users = d; this.loading = false; },
      error: () => { this.error = 'Não foi possível listar usuários.'; this.loading = false; },
    });
  }
  open(u: UserListItem): void { void this.router.navigate(['/app/admin/usuarios', u.id]); }
}
