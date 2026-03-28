import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Só repassa rotas filhas (`/app`, `/app/admin/...`, `/app/busca`…). */
@Component({
  selector: 'app-layout-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppLayoutRootComponent {}
