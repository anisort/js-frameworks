import { Injectable } from '@angular/core';
import { Task } from '../core/models/task.model';
import { tasks } from '../core/moc_data/tasks'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [...tasks];
  constructor() { }
}
