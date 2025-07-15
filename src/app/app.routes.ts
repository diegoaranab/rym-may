import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
                            .then(m => m.DashboardComponent)
      },
    ]
  },

  // Wildcard: any unknown URL ⇒ home
  { path: '**', redirectTo: '' },
];
