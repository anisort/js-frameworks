import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AuthUser } from '../../core/models/auth.model';

export interface AuthState extends EntityState<AuthUser> {
  currentUserId: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  registered: boolean;
  passwordResetEmailSent: boolean;
  confirmEmailSuccess: boolean;
  resetPasswordSuccess: boolean;
}

export const authAdapter: EntityAdapter<AuthUser> = createEntityAdapter<AuthUser>(
  {
    selectId: model => model.id
  }
);

export const initialAuthEntityState: AuthState = authAdapter.getInitialState({
  currentUserId: null,
  token: null,
  loading: false,
  error: null,
  registered: false,
  passwordResetEmailSent: false,
  confirmEmailSuccess: false,
  resetPasswordSuccess: false,
});
