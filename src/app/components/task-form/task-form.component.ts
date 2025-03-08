import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
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
  @Input() editTask: Task | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['editTask'] && this.editTask){
      this.task = {...this.editTask};
    }
    //this.formattedDate = this.task.date ? new Date(this.task.date).toISOString().split('T')[0] : '';
  }

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
