import { TaskStatus } from '../../share/core/models/status.enum';
import { Task } from '../../share/core/models/task.model';
import { createAction, props } from '@ngrx/store';

// Load
export const loadTasks = createAction(
  '[Task] Load All',
  props<{ page: number; pageSize: number; filter?: string; status?: TaskStatus | string }>()
);

export const loadTasksSuccess = createAction(
  '[Task] Load All Success',
  props<{ tasks: Task[], total: number }>()
);

export const loadTasksFailure = createAction(
  '[Task] Load All Failure',
  props<{ error: string }>()
);

// Create
export const createTask = createAction(
  '[Task] Create',
  props<{ task: Task }>()
);

export const createTaskSuccess = createAction(
  '[Task] Create Success',
  props<{ task: Task }>()
);

export const createTaskFailure = createAction(
  '[Task] Create Failure',
  props<{ error: string }>()
);

// Update
export const updateTask = createAction(
  '[Task] Update',
  props<{ task: Task }>()
);

export const updateTaskSuccess = createAction(
  '[Task] Update Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Task] Update Failure',
  props<{ error: string }>()
);

// Patch
export const patchTask = createAction(
  '[Task] Patch',
  props<{ id: string; changes: Partial<Task> }>()
);

export const patchTaskSuccess = createAction(
  '[Task] Patch Success',
  props<{ task: Task }>()
);

export const patchTaskFailure = createAction(
  '[Task] Patch Failure',
  props<{ error: string }>()
);

// Delete
export const deleteTask = createAction(
  '[Task] Delete',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Success',
  props<{ id: string, total: number }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Failure',
  props<{ error: string }>()
);

// Select
export const selectTask = createAction(
  '[Task] Select',
  props<{ id: string | null }>()
);

// Filter
export const setFilterStatus = createAction(
  '[Task] Set Filter Status',
  props<{ status: string }>()
)

export const clearTaskError = createAction(
  '[Task] Clear Task Error',
)
