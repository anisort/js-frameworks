import {Inject, Injectable} from '@angular/core';
import {Task, TaskLoad} from '../../core/models/task.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig, CONFIG_TOKEN} from '../../core/config/config';
import {delay, map, Observable} from 'rxjs';
import {TaskApi, TaskLoadApi} from '../../core/models/task-api.model';
import {TaskAdapter} from '../../core/adapters/task.adapter';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) { }

  getTasks(page: number, pageSize: number, filter?: string, status?: string): Observable<TaskLoad> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', pageSize);

    if (filter) params = params.set('filter', filter);
    if (status) params = params.set('status', status);

    return this.http.get<TaskLoadApi>(`${this.config.apiUrl}/v2/tasks`, { params: params }).pipe(
      map(TaskAdapter.fromLoadAPI),
    );
  }

  createTask(newTask: Task): Observable<Task> {
    return this.http.post<TaskApi>(`${this.config.apiUrl}/v2/tasks`, TaskAdapter.toAPI(newTask)).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  updateTask(id: string, updateTask: Task): Observable<Task> {
    return this.http.put<TaskApi>(`${this.config.apiUrl}/v2/tasks/${id}`, TaskAdapter.toAPI(updateTask)).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  patchTask(id: string, updateTask: Partial<Task>): Observable<Task> {
    const formattedTask = TaskAdapter.toPartialApi(updateTask);
    return this.http.patch<TaskApi>(`${this.config.apiUrl}/v2/tasks/${id}`, {...updateTask, ...formattedTask}).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  deleteTask(id: string): Observable<{ message: string, total: number }> {
    return this.http.delete<{ message: string, total: number }>(`${this.config.apiUrl}/v2/tasks/${id}`);
  }
}
