import {Inject, Injectable} from '@angular/core';
import { Task } from '../core/models/task.model';
import { tasks } from '../core/moc_data/tasks'
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppConfig, CONFIG_TOKEN} from '../share/config/config';
import {Observable} from 'rxjs';

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
    return this.http.get<Task[]>(`${this.config.apiUrl}/v1/tasks`, {params: params});
  }

  createTask(newTask: Task): Observable<Task> {
    return this.http.post<Task>(`${this.config.apiUrl}/v1/tasks`, newTask);
  }

  updateTask(id: number, updateTask: Task): Observable<Task> {
    const { id: _, ...update } = updateTask;
    return this.http.put<Task>(`${this.config.apiUrl}/v1/tasks/${id}`, update)
  }

  patchTask(id: number, updateTask: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.config.apiUrl}/v1/tasks/${id}`, updateTask)
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.config.apiUrl}/v1/tasks/${id}`);
  }
}
