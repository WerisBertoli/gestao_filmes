import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';
import { comumGuard } from './core/comum.guard';
import { AppHomeRedirectComponent } from './pages/app-home-redirect/app-home-redirect.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./pages/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: AppHomeRedirectComponent },
      {
        path: 'busca',
        canActivate: [comumGuard],
        loadComponent: () =>
          import('./pages/search/search.component').then(
            (m) => m.SearchComponent,
          ),
      },
      {
        path: 'favoritos',
        canActivate: [comumGuard],
        loadComponent: () =>
          import('./pages/favorites/favorites.component').then(
            (m) => m.FavoritesComponent,
          ),
      },
      {
        path: 'assistidos',
        canActivate: [comumGuard],
        loadComponent: () =>
          import('./pages/watched/watched.component').then(
            (m) => m.WatchedComponent,
          ),
      },
      {
        path: 'admin/rankings',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-rankings/admin-rankings.component').then(
            (m) => m.AdminRankingsComponent,
          ),
      },
      {
        path: 'admin/usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent,
          ),
      },
      {
        path: 'admin/usuarios/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin-user-detail/admin-user-detail.component').then(
            (m) => m.AdminUserDetailComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
