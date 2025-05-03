import {TaskState} from './task/task.state';
import {RouterState} from './router/router.state';
import {RouterReducerState} from '@ngrx/router-store';
import {AuthState} from './auth/auth.state';

export interface AppState {
  tasks: TaskState,
  auth: AuthState,
  router: RouterReducerState<RouterState>
}
