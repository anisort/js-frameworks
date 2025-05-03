import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import {authAdapter, AuthState, initialAuthEntityState} from './auth.state';

export const authReducer = createReducer(
  initialAuthEntityState,

  // Register
  on(AuthActions.register, (state: AuthState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state: AuthState) => ({
    ...state,
    loading: false,
    registered: true,
  })),
  on(AuthActions.registerFailure, (state: AuthState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Login
  on(AuthActions.login, (state: AuthState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state: AuthState, { user, token }) => {
    return authAdapter.setOne(user, {
      ...state,
      loading: false,
      token,
      currentUserId: user.id,
    })
  }),
  on(AuthActions.loginFailure, (state: AuthState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) =>
    authAdapter.removeAll({
      ...state,
      currentUserId: null,
      token: null,
      loading: false,
      error: null,
      registered: false,
      passwordResetEmailSent: false,
      confirmEmailSuccess: false,
      resetPasswordSuccess: false,
    })
  ),

  // Request to reset password
  on(AuthActions.requestResetPassword, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.requestResetPasswordSuccess, (state) => ({
    ...state,
    loading: false,
    passwordResetEmailSent: true,
  })),
  on(AuthActions.requestResetPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset password
  on(AuthActions.resetPassword, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.resetPasswordSuccess, state => ({
    ...state,
    loading: false,
    resetPasswordSuccess: true,
  })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Confirm email
  on(AuthActions.confirmEmail, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.confirmEmailSuccess, state => ({
    ...state,
    loading: false,
    confirmEmailSuccess: true,
  })),
  on(AuthActions.confirmEmailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Resetting the state after an action
  on(AuthActions.clearAuthState, (state) => ({
    ...state,
    error: null,
    registered: false,
    passwordResetEmailSent: false,
    confirmEmailSuccess: false,
    resetPasswordSuccess: false,
  })),

)

