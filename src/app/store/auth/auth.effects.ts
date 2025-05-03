import { inject, Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { AuthService } from '../../outside/services/auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import *  as AuthActions from './auth.actions';
import {formatError} from '../../share/utils/error.util';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store = inject(Store<any>);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({user, token}) => AuthActions.loginSuccess({ user, token })),
          catchError(err => of(AuthActions.loginFailure({ error: formatError(err) })))
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate([
          'workbench',
          {
            outlets: {
              primary: ['tasks', 'list'],
              aside: ['stats']
            }
          }
        ]))
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({email, password}) =>
        this.authService.register(email, password).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(err =>
            of(AuthActions.registerFailure({ error: formatError(err) }))
          )
        )
      )
    )
  );

  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestResetPassword),
      exhaustMap(({ email }) =>
        this.authService.requestPasswordReset(email).pipe(
          map(() => AuthActions.requestResetPasswordSuccess()),
          catchError(err =>
            of(AuthActions.requestResetPasswordFailure({ error: formatError(err) }))
          )
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      exhaustMap(({ token, password }) =>
        this.authService.resetPassword(token, password).pipe(
          map(() => AuthActions.resetPasswordSuccess()),
          catchError(err =>
            of(AuthActions.resetPasswordFailure({ error: formatError(err) }))
          )
        )
      )
    )
  );

  confirmEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmEmail),
      exhaustMap(({ token }) =>
        this.authService.confirmEmail(token).pipe(
          map(() => AuthActions.confirmEmailSuccess()),
          catchError(err =>
            of(AuthActions.confirmEmailFailure({ error: formatError(err) }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
