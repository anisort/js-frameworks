import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }

  protected readonly TaskStatus = TaskStatus;

  getStatusClasses(){
    return {
      'done': this.task.status === TaskStatus.DONE,
      'todo': this.task.status === TaskStatus.TODO,
      'in-progress': this.task.status === TaskStatus.IN_PROGRESS,
    }
  }


  updateStatus(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.task.status = selectedValue as TaskStatus;
  }


}
