import { createReducer, on } from '@ngrx/store';
import {initialState, taskAdapter} from './task.state';
import * as TaskActions from './task.actions';
import {TaskState} from './task.state';

export const taskReducer = createReducer(
  initialState,

  // Load
  on(TaskActions.loadTasks, (state: TaskState) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state: TaskState, { tasks, total }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      total,
      loading: false,
      error: null
    })
  ),

  on(TaskActions.loadTasksFailure, (state: TaskState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(TaskActions.createTask, (state: TaskState) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.createTaskSuccess, (state: TaskState, { task }) =>
    taskAdapter.addOne(task, { ...state, loading: false, error: null })
  ),

  on(TaskActions.createTaskFailure, (state: TaskState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(TaskActions.updateTask, (state: TaskState) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.updateTaskSuccess, (state: TaskState, { task }) =>
    taskAdapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false, error: null })
  ),

  on(TaskActions.updateTaskFailure, (state: TaskState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Patch
  on(TaskActions.patchTask, (state: TaskState) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TaskActions.patchTaskSuccess, (state: TaskState, { task }) =>
    taskAdapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false, error: null })
  ),
  on(TaskActions.patchTaskFailure, (state: TaskState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete
  on(TaskActions.deleteTask, (state: TaskState) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.deleteTaskSuccess, (state: TaskState, { id, total }) =>
    taskAdapter.removeOne(id, { ...state, total, loading: false})
  ),

  on(TaskActions.deleteTaskFailure, (state: TaskState, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Select
  on(TaskActions.selectTask, (state: TaskState, { id }) => ({
    ...state,
    selectedTaskId: id,
  })),

  // Filter
  on(TaskActions.setFilterStatus, (state: TaskState, { status }) => ({
    ...state,
    filterStatus: status
  })),


  // Clear errors
  on(TaskActions.clearTaskError, state => ({
    ...state,
    error: null,
  }))

);
