import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { Task } from '../../core/models/task.model';
import {formatError} from '../../share/utils/error.util';

@Injectable()
export class TaskEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(({ status }) =>
        this.taskService.getTasks(status).pipe(
          map((tasks: Task[]) => TaskActions.loadTasksSuccess({ tasks })),
          catchError(err => {
            return of(TaskActions.loadTasksFailure({ error: formatError(err) }));
          })
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask: Task) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError(err => {
            return of(TaskActions.createTaskFailure({ error: formatError(err) }));
          })
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ task }) =>
        this.taskService.updateTask(task.id, task).pipe(
          map((updatedTask: Task) => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError(err => {
            return of(TaskActions.updateTaskFailure({ error: formatError(err) }));
          })
        )
      )
    )
  );

  patchTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.patchTask),
      switchMap(({ id, changes }) =>
        this.taskService.patchTask(id, changes).pipe(
          map((updatedTask: Task) => TaskActions.patchTaskSuccess({ task: updatedTask })),
          catchError(err => {
            return of(TaskActions.patchTaskFailure({ error: formatError(err) }));
          })
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(err => {
            return of(TaskActions.deleteTaskFailure({ error: formatError(err) }));
          })
        )
      )
    )
  );

  resetError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TaskActions.createTaskFailure,
        TaskActions.updateTaskFailure,
        TaskActions.loadTasksFailure,
        TaskActions.deleteTaskFailure,
        TaskActions.patchTaskFailure,
      ),
      map(() => TaskActions.clearTaskError())
    )
  );

}
