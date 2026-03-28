import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: `<p class="muted">Carregando…</p>`,
  styles: [
    `
      :host {
        display: block;
        padding: 2rem;
        text-align: center;
      }
      .muted {
        color: #6b7a99;
        margin: 0;
      }
    `,
  ],
})
export class AppHomeRedirectComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const url = this.auth.isAdmin()
      ? '/app/admin/rankings'
      : '/app/busca';
    void this.router.navigateByUrl(url);
  }
}
