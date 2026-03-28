import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Apenas repassa rotas filhas (`rankings`, `usuarios`, …) sob `/app/admin`. */
@Component({
  selector: 'app-admin-outlet',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AdminOutletComponent {}
