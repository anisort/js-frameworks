import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {taskReducer} from './store/task/task.reducer';
import {authReducer} from './store/auth/auth.reducer';
import {provideRouterStore, routerReducer} from '@ngrx/router-store';
import {provideEffects} from '@ngrx/effects';
import {TaskEffects} from './store/task/task.effects';
import {AuthEffects} from './store/auth/auth.effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {AuthInterceptor} from './core/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({
      tasks: taskReducer,
      auth: authReducer,
      router: routerReducer,
    }),
    provideEffects([TaskEffects, AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideRouterStore(),
    importProvidersFrom(MatSnackBarModule, MatDialogModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
};
