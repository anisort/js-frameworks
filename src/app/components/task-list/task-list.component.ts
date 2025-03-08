import {Component} from '@angular/core';
import { Task } from '../../core/models/task.model';
import {tasks} from '../../core/moc_data/tasks';
import {TaskStatus} from '../../core/models/status.enum';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  myTasks: Task[] = tasks;
  protected readonly TaskStatus = TaskStatus;

  selectedStatus!: TaskStatus | 'all';

  deleteTask(index: number): void {
    this.myTasks = this.myTasks.filter(task=> task.id !== index);
  }

  onSelected(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.selectedStatus = status as TaskStatus | 'all';
  }

  addTask(task: Task): void {
    if(this.editingTask){
      this.myTasks = this.myTasks.map(t =>
        t.id === task.id ? {...task} : t
      );
      this.editingTask = null;
    }
    else {
      const maxId = this.myTasks.length > 0 ? Math.max(...this.myTasks.map(task => task.id)) : 0;
      task = {
        ...task,
        id: maxId + 1,
      }
      this.myTasks.push(task);
    }
  }

  editingTask: Task | null = null;
  editTask(task: Task): void {
    this.editingTask = {...task};
  }
}
