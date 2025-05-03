import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './inside/components/task-layout/task-list/task-list.component';
import { TaskItemComponent } from './inside/components/task-layout/task-item/task-item.component';
import { StatusFilterPipe } from './inside/pipes/status-filter.pipe';
import { TaskFormComponent } from './inside/components/task-layout/task-form/task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { TaskStatusPipe } from './inside/pipes/task-status.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {AppState} from './store/app.state';
import {taskReducer} from './store/task/task.reducer';
import {TaskEffects} from './store/task/task.effects';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import { TaskStatsComponent } from './inside/components/task-layout/task-stats/task-stats.component';
import { PageNotFoundComponent } from './outside/components/page-not-found/page-not-found.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {authReducer} from './store/auth/auth.reducer';
import {AuthEffects} from './store/auth/auth.effects';
import { LoginComponent } from './outside/components/auth/login/login.component';
import { WorkbenchLayoutComponent } from './inside/components/workbench-layout/workbench-layout.component';
import { TaskLayoutComponent } from './inside/components/task-layout/task-layout.component';
import { RegisterComponent } from './outside/components/auth/register/register.component';
import { ConfirmEmailComponent } from './outside/components/auth/confirm-email/confirm-email.component';
import { RequestResetPasswordComponent } from './outside/components/auth/request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './outside/components/auth/reset-password/reset-password.component';
import {AuthInterceptor} from './outside/interceptors/auth.interceptors';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskItemComponent,
    StatusFilterPipe,
    TaskFormComponent,
    TaskStatusPipe,
    TaskStatsComponent,
    PageNotFoundComponent,
    LoginComponent,
    WorkbenchLayoutComponent,
    TaskLayoutComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RequestResetPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    StoreModule.forRoot<AppState>({
      tasks: taskReducer,
      auth: authReducer,
      router: routerReducer
    }),
    EffectsModule.forRoot([TaskEffects, AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    })
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
