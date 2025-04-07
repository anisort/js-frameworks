import {Inject, Injectable} from '@angular/core';
import { Task } from '../core/models/task.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig, CONFIG_TOKEN} from '../share/config/config';
import {delay, map, Observable} from 'rxjs';
import {TaskApi} from '../core/models/task-api.model';
import {TaskAdapter} from '../share/adapters/task.adapter';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) { }

  getTasks(status?: string): Observable<Task[]> {
    let params = new HttpParams();
    if(status) params = params.set('status', status)
    return this.http.get<TaskApi[]>(`${this.config.apiUrl}/v2/tasks`, {params: params}).pipe(
      map((tasks: TaskApi[]): Task[] => tasks.map(task => TaskAdapter.fromAPI(task))), delay(1000)
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

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiUrl}/v2/tasks/${id}`);
  }
}
