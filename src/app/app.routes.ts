import {Routes} from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
export const routes: Routes = [
  {path: '', redirectTo: '/workbench/(tasks/list//aside:stats)', pathMatch: 'full'},
  {
    path: 'workbench',
    loadComponent: () => import('./inside/components/workbench-layout/workbench-layout.component')
      .then(c => c.WorkbenchLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./inside/components/task-layout/task-layout.component')
          .then(c => c.TaskLayoutComponent),
        children: [
          {
            path: 'list',
            loadComponent: () => import('./inside/components/task-layout/task-list/task-list.component')
              .then(c => c.TaskListComponent),
          },
          {
            path: 'view/:id',
            loadComponent: () => import('./inside/components/task-layout/task-item/task-item.component')
              .then(c => c.TaskItemComponent),
          },
        ]
      },
      {
        path: 'stats',
        loadComponent: () => import('./inside/components/task-layout/task-stats/task-stats.component')
          .then(c => c.TaskStatsComponent),
        outlet: 'aside'
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./outside/components/auth/login/login.component')
      .then(c => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./outside/components/auth/register/register.component')
      .then(c => c.RegisterComponent),
  },
  {
    path: 'confirm/:token',
    loadComponent: () => import('./outside/components/auth/confirm-email/confirm-email.component')
      .then(c => c.ConfirmEmailComponent),
  },
  {
    path: 'request-reset',
    loadComponent: () => import('./outside/components/auth/request-reset-password/request-reset-password.component')
      .then(c => c.RequestResetPasswordComponent),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./outside/components/auth/reset-password/reset-password.component')
      .then(c => c.ResetPasswordComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/page-not-found/page-not-found.component')
      .then(c => c.PageNotFoundComponent),
  }
]
