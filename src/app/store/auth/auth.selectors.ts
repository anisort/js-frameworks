import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authAdapter, AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = authAdapter.getSelectors(selectAuthState);

export const selectCurrentUserId = createSelector(
  selectAuthState,
  (state) => state.currentUserId
);

export const selectCurrentUser = createSelector(
  selectEntities,
  selectCurrentUserId,
  (entities, currentUserId) => currentUserId ? entities[currentUserId] : null
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectRegistered = createSelector(
  selectAuthState,
  (state) => state.registered
);

export const selectPasswordResetEmailSent = createSelector(
  selectAuthState,
  (state) => state.passwordResetEmailSent
);

export const selectConfirmEmailSuccess = createSelector(
  selectAuthState,
  (state) => state.confirmEmailSuccess
);

export const selectResetPasswordSuccess = createSelector(
  selectAuthState,
  (state) => state.resetPasswordSuccess
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (token) => !!token,
)
