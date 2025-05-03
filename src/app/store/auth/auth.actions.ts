import {createAction, props} from '@ngrx/store';
import {AuthUser} from '../../core/models/auth.model';

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string}>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction(
  '[Auth] Logout',
);

// Request to reset password
export const requestResetPassword = createAction(
  '[Auth] Request Reset Password',
  props<{ email: string }>()
);

export const requestResetPasswordSuccess = createAction(
  '[Auth] Request Reset Password Success'
);

export const requestResetPasswordFailure = createAction(
  '[Auth] Request Reset Password Failure',
  props<{ error: string }>()
);

// Reset password
export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ token: string; password: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success'
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

// Confirm email
export const confirmEmail = createAction(
  '[Auth] Confirm Email',
  props<{ token: string }>()
);

export const confirmEmailSuccess = createAction(
  '[Auth] Confirm Email Success'
);

export const confirmEmailFailure = createAction(
  '[Auth] Confirm Email Failure',
  props<{ error: string }>()
);

// Resetting the state after an action
export const clearAuthState = createAction(
  '[Auth] Clear Auth State',
)
