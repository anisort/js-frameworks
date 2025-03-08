import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnChanges{

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    dueDate: new FormControl('', Validators.required),
    assignee: new FormControl('', Validators.required),
    status: new FormControl(TaskStatus.TODO, Validators.required),
  })
  task!: Task;

  @Output()
  taskAdd = new EventEmitter<Task>();
  @Input() editTask: Task | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['editTask'] && this.editTask){
      this.task = {...this.editTask};
    }
  }


  protected readonly TaskStatus = TaskStatus;

  addTask(): void {
    if (this.taskForm.valid){
      let taskData = {
        ...this.taskForm.value,
        dueDate: this.taskForm.value.dueDate ? new Date(this.taskForm.value.dueDate) : new Date(),
      };
      this.taskAdd.emit(taskData as Task);
      this.taskForm.reset();
    }
  }
}
