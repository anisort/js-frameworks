import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, finalize, of, switchMap, tap, throwError} from 'rxjs';
import {Task, TaskLoad} from '../../share/core/models/task.model';
import {TaskService} from '../services/task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskStateService {

  private _tasks$ = new BehaviorSubject<Task[]>([]);
  private _selectedTask = new BehaviorSubject<Task | null>(null);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _error$ = new BehaviorSubject<string | null>(null);

  public readonly task$ = this._tasks$.asObservable();
  public readonly selectedTask$ = this._selectedTask.asObservable();
  public readonly loading$ = this._loading$.asObservable();
  public readonly error$ = this._error$.asObservable();

  constructor(private taskService: TaskService) { }

  loadTasks(status?: string): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.getTasks(1, 10, undefined, status)
      .pipe(
        tap((response: TaskLoad) => this._tasks$.next(response.tasks)),
        catchError(err => {
          this._error$.next((err.error.errors) ? err.error.message + '. ' + err.error.errors : err.error.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false)),
      ).subscribe()
  }

  createTask(task: Task): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.createTask(task)
      .pipe(
        switchMap((added: Task) => {
          const current = this._tasks$.getValue();
          return of([...current, added]);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next((err.error.errors) ? err.error.message + '. ' + err.error.errors : err.error.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false)),
      ).subscribe()
  }

  updateTask(task: Task): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.updateTask(task.id, task)
      .pipe(
        switchMap(updated => {
          const current = this._tasks$.getValue();
          const updatedTasks = current.map(t => t.id === updated.id ? updated : t);
          return of(updatedTasks);
        }),
        tap(updatedTasks => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next((err.error.errors) ? err.error.message + '. ' + err.error.errors : err.error.message);
          return throwError(() => err.message);
        }),
        finalize(() : void => this._loading$.next(false))
      ).subscribe()
  }

  patchTask(id: string, task: Partial<Task>): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.patchTask(id, task)
      .pipe(
        switchMap(patched => {
          const updated: Task[] = this._tasks$.getValue().map(t =>
            t.id === patched.id ? Object.assign({}, t, patched) : t
          );
          return of(updated);
        }),
        tap(updatedTasks => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next((err.error.errors) ? err.error.message + '. ' + err.error.errors : err.error.message);
          return throwError(() => err.message);
        }),
        finalize(() : void => this._loading$.next(false))).subscribe()
  }

  deleteTask(id: string): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.deleteTask(id)
      .pipe(
        switchMap(() => {
          const filtered: Task[] = this._tasks$.getValue().filter(t  => t.id !== id);
          return of(filtered);
        }),
        tap(updatedList => this._tasks$.next(updatedList)),
        catchError(err => {
          this._error$.next((err.error.errors) ? err.error.message + '. ' + err.error.errors : err.error.message);
          return throwError(() => err.message);
        }),
        finalize(() : void => this._loading$.next(false))
      ).subscribe()
  }

  selectTask(task: Task | null): void {
    this._selectedTask.next(task);
  }



}
