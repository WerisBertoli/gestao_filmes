import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, DxTextBoxModule, DxButtonModule],
  template: `
    <div class="card">
      <h2>Cadastro</h2>
      <p class="hint">Conta criada como usuário COMUM.</p>
      <dx-text-box
        [(value)]="email"
        placeholder="E-mail"
        mode="email"
        [inputAttr]="{ autocomplete: 'email' }"
      />
      <dx-text-box
        [(value)]="password"
        placeholder="Senha (mín. 6)"
        mode="password"
        [inputAttr]="{ autocomplete: 'new-password' }"
      />
      @if (error) {
        <p class="error">{{ error }}</p>
      }
      <dx-button
        text="Cadastrar"
        type="default"
        stylingMode="contained"
        [disabled]="loading"
        (onClick)="submit()"
      />
      <p><a routerLink="/login">Já tenho conta</a></p>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      .card {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .error {
        color: #c62828;
        margin: 0;
      }
      .hint {
        font-size: 0.85rem;
        color: #666;
        margin: 0;
      }
    `,
  ],
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  submit(): void {
    this.error = '';
    this.loading = true;
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => void this.router.navigate(['/app/busca']),
      error: (err: { error?: { message?: string | string[] } }) => {
        this.loading = false;
        const m = err?.error?.message;
        this.error = Array.isArray(m) ? m.join(', ') : m ?? 'Falha no cadastro';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
