import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, DxTextBoxModule, DxButtonModule],
  template: `
    <div class="auth-wrap">
      <div class="auth-left">
        <div class="brand-block">
          <div class="brand-logo">MK</div>
          <h1 class="brand-title">Microkids</h1>
          <p class="brand-tagline">Gestão de Filmes</p>
        </div>
        <div class="brand-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-card">
          <div class="card-top">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com sua conta para continuar</p>
          </div>
          <div class="fields">
            <div class="field">
              <label>E-mail</label>
              <dx-text-box [(value)]="email" placeholder="seu@email.com" mode="email" stylingMode="outlined" [inputAttr]="{autocomplete:'email'}" />
            </div>
            <div class="field">
              <label>Senha</label>
              <div class="pass-wrap">
                <dx-text-box [(value)]="password" placeholder="Sua senha" [mode]="showPass() ? 'text' : 'password'" stylingMode="outlined" [inputAttr]="{autocomplete:'current-password'}" />
                <button type="button" class="pass-toggle" (click)="showPass.set(!showPass())" [title]="showPass() ? 'Ocultar senha' : 'Ver senha'">
                  {{ showPass() ? '&#128065;&#65039;' : '&#128065;' }}
                </button>
              </div>
            </div>
          </div>
          @if (error) { <div class="alert-error">{{ error }}</div> }
          <dx-button text="Entrar" type="default" stylingMode="contained" width="100%" [disabled]="loading" (onClick)="submit()" />
          <p class="switch-link">Não tem conta? <a routerLink="/register">Cadastre-se</a></p>
          <details class="demo-box">
            <summary>Conta administrador (demonstração)</summary>
            <p class="demo-note">
              Crie o usuário com <code>pnpm db:seed</code> na raiz (após
              <code>pnpm db:migrate</code>).
            </p>
            <dl class="demo-creds">
              <dt>E-mail</dt>
              <dd>{{ demoAdminEmail }}</dd>
              <dt>Senha</dt>
              <dd>{{ demoAdminPassword }}</dd>
            </dl>
          </details>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { display: flex; min-height: 100vh; }
    .auth-left { flex: 1; background: linear-gradient(145deg, #0F1A35 0%, #1D398C 60%, #003F71 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; position: relative; overflow: hidden; min-width: 340px; }
    .auth-left::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(101,236,236,0.15), transparent 70%); top: -80px; right: -80px; }
    .auth-left::after { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(210,224,3,0.12), transparent 70%); bottom: -60px; left: -60px; }
    .brand-block { display: flex; flex-direction: column; align-items: center; gap: 1rem; z-index: 1; }
    .brand-logo { width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #D2E003, #65ECEC); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.6rem; color: #0F1A35; box-shadow: 0 8px 32px rgba(210,224,3,0.35); }
    .brand-title { color: #fff; font-size: 2rem; font-weight: 800; margin: 0; letter-spacing: -0.03em; }
    .brand-tagline { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin: 0; }
    .brand-dots { display: flex; gap: 0.5rem; margin-top: 3rem; z-index: 1; }
    .brand-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.25); }
    .brand-dots span:first-child { background: #D2E003; width: 24px; border-radius: 4px; }
    .auth-right { flex: 0 0 480px; display: flex; align-items: center; justify-content: center; padding: 2rem; background: #F4F7FC; }
    .auth-card { width: 100%; max-width: 400px; background: #fff; border-radius: 20px; box-shadow: 0 8px 40px rgba(29,57,140,0.12); padding: 2.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .card-top h2 { font-size: 1.5rem; font-weight: 800; color: #0F1A35; margin: 0 0 0.35rem; }
    .card-top p { color: #6B7A99; font-size: 0.875rem; margin: 0; }
    .fields { display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { font-size: 0.78rem; font-weight: 600; color: #3A4A6B; text-transform: uppercase; letter-spacing: 0.06em; }
    .alert-error { background: #FFF2F2; border-left: 3px solid #D63939; color: #B02020; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.85rem; }
    .switch-link { text-align: center; color: #6B7A99; font-size: 0.875rem; margin: 0; }
    .switch-link a { color: #1D398C; font-weight: 600; }
    .demo-box { border: 1px dashed #DDE3F0; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.78rem; color: #6B7A99; cursor: pointer; }
    .demo-box summary { font-weight: 500; }
    .demo-note { margin: 0.35rem 0 0.5rem; font-size: 0.72rem; line-height: 1.4; color: #6B7A99; }
    .demo-note code { font-size: 0.7rem; background: #F0F3FA; padding: 0.1rem 0.25rem; border-radius: 4px; }
    .demo-creds { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.75rem; font-size: 0.78rem; align-items: baseline; }
    .demo-creds dt { font-weight: 600; color: #3A4A6B; margin: 0; }
    .demo-creds dd { margin: 0; font-family: ui-monospace, monospace; color: #1D398C; }
    .pass-wrap { position: relative; }
    .pass-wrap dx-text-box { display: block; }
    .pass-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; color: #6B7A99; padding: 0.25rem; line-height: 1; z-index: 1; }
    .pass-toggle:hover { color: #1D398C; }
    @media (max-width: 720px) { .auth-left { display: none; } .auth-right { flex: 1; } }
  `],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  /** Igual a `apps/api/prisma/seed.ts` */
  readonly demoAdminEmail = 'admin@microkids.test';
  readonly demoAdminPassword = 'admin123';
  email = '';
  password = '';
  loading = false;
  error = '';
  readonly showPass = signal(false);

  submit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => void this.router.navigateByUrl(this.auth.postLoginPath()),
      error: (err: { error?: { message?: string | string[] } }) => {
        this.loading = false;
        const m = err?.error?.message;
        this.error = Array.isArray(m) ? m.join(', ') : (m ?? 'Falha no login');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
