import {Component, EventEmitter, Output} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  task!: Task;

  @Output()
  taskAdd = new EventEmitter<Task>();

  ngOnInit(): void {
    this.task = {
      id: -1,
      title: '',
      description: '',
      dueDate: new Date(),
      assignee: '',
      status: TaskStatus.TODO
    }
  }

  protected readonly TaskStatus = TaskStatus;

  addTask(taskForm: NgForm): void {
    const copyTask = {
      ...this.task,
      dueDate: new Date(this.task.dueDate),
    }
    taskForm.reset();
    this.taskAdd.emit(copyTask);
  }
}
