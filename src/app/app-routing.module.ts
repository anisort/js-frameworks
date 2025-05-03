import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './inside/components/task-layout/task-list/task-list.component';
import { TaskStatsComponent } from './inside/components/task-layout/task-stats/task-stats.component';
import { TaskItemComponent } from './inside/components/task-layout/task-item/task-item.component';
import { PageNotFoundComponent } from './outside/components/page-not-found/page-not-found.component';
import {LoginComponent} from './outside/components/auth/login/login.component';
import {WorkbenchLayoutComponent} from './inside/components/workbench-layout/workbench-layout.component';
import {TaskLayoutComponent} from './inside/components/task-layout/task-layout.component';
import {RegisterComponent} from './outside/components/auth/register/register.component';
import {ConfirmEmailComponent} from './outside/components/auth/confirm-email/confirm-email.component';
import {
  RequestResetPasswordComponent
} from './outside/components/auth/request-reset-password/request-reset-password.component';
import {ResetPasswordComponent} from './outside/components/auth/reset-password/reset-password.component';
import {AuthGuard} from './outside/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/workbench/(tasks//list:stats)', pathMatch: 'full' },
  {path: 'workbench', component: WorkbenchLayoutComponent, canActivate: [AuthGuard],
    children: [
      {path: 'tasks', component: TaskLayoutComponent,
        children: [
          { path: 'list', component: TaskListComponent },
          { path: 'view/:id', component: TaskItemComponent },
        ],
      },
      { path: 'stats', component: TaskStatsComponent, outlet: 'aside' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm/:token', component: ConfirmEmailComponent },
  { path: 'request-reset', component: RequestResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
