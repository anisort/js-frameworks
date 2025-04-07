import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {TaskFormValidator} from '../../share/directives/task-form.validator';
import {Subject, takeUntil} from 'rxjs';
import {TaskStateService} from '../../share/state/task-state.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  editMode: boolean = false;
  taskForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('',
      TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])),
    dueDate: new FormControl('', [Validators.required,
      TaskFormValidator.dateValidator]),
    assignee: new FormControl('', Validators.required),
    status: new FormControl<TaskStatus>(TaskStatus.TODO, Validators.required),
  })
  protected readonly TaskStatus = TaskStatus;
  constructor(
    private taskStateService: TaskStateService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
  ) {
  }
  ngOnInit(): void {
    this.taskStateService.selectedTask$.pipe(takeUntil(this.destroy$)).subscribe((task) =>
    {
      if (task) {
        this.taskForm.patchValue(task);
        this.editMode = true;
      } else {
        this.taskForm.reset({status: TaskStatus.TODO});
        this.editMode = false;
      }
    })
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.editMode) {
        this.taskStateService.updateTask(this.taskForm.value as Task);
        this.taskStateService.selectTask(null);
      } else {
        this.taskStateService.createTask(this.taskForm.value as Task);
      }
      this.dialogRef.close();
    }
  }
  ngOnDestroy() {
    this.taskStateService.selectTask(null);
    this.destroy$.next();
    this.destroy$.complete();
  }
}

