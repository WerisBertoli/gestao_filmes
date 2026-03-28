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
      import('./pages/app-layout-root/app-layout-root.component').then(
        (m) => m.AppLayoutRootComponent,
      ),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: AppHomeRedirectComponent },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/shell-admin/shell-admin.component').then(
            (m) => m.ShellAdminComponent,
          ),
        canActivate: [adminGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'rankings' },
          {
            path: 'rankings',
            loadComponent: () =>
              import('./pages/admin-rankings/admin-rankings.component').then(
                (m) => m.AdminRankingsComponent,
              ),
          },
          {
            path: 'usuarios',
            loadComponent: () =>
              import('./pages/admin-users/admin-users.component').then(
                (m) => m.AdminUsersComponent,
              ),
          },
          {
            path: 'usuarios/:id',
            loadComponent: () =>
              import(
                './pages/admin-user-detail/admin-user-detail.component'
              ).then((m) => m.AdminUserDetailComponent),
          },
        ],
      },
      {
        path: '',
        loadComponent: () =>
          import('./pages/shell-comum/shell-comum.component').then(
            (m) => m.ShellComumComponent,
          ),
        canActivate: [comumGuard],
        children: [
          {
            path: 'busca',
            loadComponent: () =>
              import('./pages/search/search.component').then(
                (m) => m.SearchComponent,
              ),
          },
          {
            path: 'favoritos',
            loadComponent: () =>
              import('./pages/favorites/favorites.component').then(
                (m) => m.FavoritesComponent,
              ),
          },
          {
            path: 'assistidos',
            loadComponent: () =>
              import('./pages/watched/watched.component').then(
                (m) => m.WatchedComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
