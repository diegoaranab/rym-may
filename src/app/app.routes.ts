import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,          // <-- the Material sidenav layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      // You’ll add more children later:
      // { path: 'students', loadComponent: () => import('./students/students.component').then(m => m.StudentsComponent) },
      // { path: 'courses',  loadComponent: () => import('./courses/courses.component').then(m => m.CoursesComponent) },
    ],
  },

  // Wildcard: any unknown URL ⇒ home
  { path: '**', redirectTo: '' },
];
