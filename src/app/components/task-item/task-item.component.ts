import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {TaskService} from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() taskEdited: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {
  }

  protected readonly TaskStatus = TaskStatus;

  deleteTask(id: number | undefined): void {
    if (!id) return;
    this.taskDeleted.emit(id);
  }

  editTask(): void {
    this.taskEdited.emit(this.task);
  }

  getStatusClasses(){
    return {
      'done': this.task.status === TaskStatus.DONE,
      'todo': this.task.status === TaskStatus.TODO,
      'in-progress': this.task.status === TaskStatus.IN_PROGRESS,
    }
  }


  updateStatus(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if(!this.task.id) return;
    this.taskService.patchTask(this.task.id, {status: selectedValue as TaskStatus}).subscribe({
      next: updatedTask => this.task.status = updatedTask.status,
      error: error => console.error('Status error', error),
    })
  }


}
