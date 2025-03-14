import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {TaskFormValidator} from '../../share/directives/task-form.validator';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnChanges{

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])),
    dueDate: new FormControl('', [Validators.required, TaskFormValidator.dateValidator]),
    assignee: new FormControl('', Validators.required),
    status: new FormControl(TaskStatus.TODO, Validators.required),
  })
  task!: Task;

  @Output()
  taskAdd = new EventEmitter<Task>();
  @Input() editTask: Task | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['editTask'] && this.editTask){
      this.taskForm.patchValue({
        ...this.editTask,
        dueDate: this.editTask.dueDate.toISOString().split("T")[0]
      });
    }
  }

  addTask(): void {
    if (this.taskForm.valid){
      let taskData = {
        ...this.taskForm.value,
        dueDate: this.taskForm.value.dueDate ? new Date(this.taskForm.value.dueDate) : new Date(),
        id: this.editTask ? this.editTask.id : undefined,
      };
      this.taskAdd.emit(taskData as Task);
      this.taskForm.reset();
    }
  }

  protected readonly TaskStatus = TaskStatus;
}
