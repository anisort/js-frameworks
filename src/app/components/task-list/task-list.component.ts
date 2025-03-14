import {Component, OnInit} from '@angular/core';
import { Task } from '../../core/models/task.model';
import {tasks} from '../../core/moc_data/tasks';
import {TaskStatus} from '../../core/models/status.enum';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {

  myTasks: Task[] = tasks;

  protected readonly TaskStatus = TaskStatus;

  selectedStatus!: TaskStatus | 'all';

  editingTask: Task | null = null;

  constructor(private taskService: TaskService,) {
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.myTasks = this.taskService.getTasks();
  }

  deleteTask(index: number): void {
    this.taskService.deleteTask(index);
    this.loadTasks();
  }

  addTask(task: Task): void {
    if (this.editingTask){
      this.taskService.updateTask(task);
      this.editingTask = null;
    } else {
      this.taskService.addTask(task);
    }
    this.loadTasks();
  }

  onSelected(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.selectedStatus = status as TaskStatus | 'all';
  }

  editTask(task: Task): void {
    this.editingTask = {...task};
  }
}
