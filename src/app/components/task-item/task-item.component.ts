import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {TaskService} from '../../services/task.service';
import {TaskStateService} from '../../share/state/task-state.service';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: Task; // отримуємо об'єкт завдання
  @Output() taskEdited: EventEmitter<Task> = new EventEmitter<Task>(); // подія для редагування завдання
  constructor(private taskStateService: TaskStateService) {
  }
  deleteTask(id: string): void {
    this.taskStateService.deleteTask(id);
  }
  editTask(): void {
    this.taskEdited.emit(this.task);
  }
  getStatusClasses() {
    return {
      'done': this.task.status === TaskStatus.DONE,
      'todo': this.task.status === TaskStatus.TODO,
      'in-progress': this.task.status === TaskStatus.IN_PROGRESS
    };
  }
  updateStatus(event: MatSelectChange) {
    const selectedValue = event.value;
    this.taskStateService.patchTask(this.task.id, {status: selectedValue});
  }
  protected readonly TaskStatus = TaskStatus;
}

