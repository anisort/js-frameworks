import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Task} from '../../core/models/task.model';
import {TaskStatus} from '../../core/models/status.enum';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {TaskFormValidator} from '../../share/directives/task-form.validator';
import {Observable, Subject, takeUntil} from 'rxjs';
import {TaskStateService} from '../../share/state/task-state.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selector';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  selectedTask$!: Observable<Task | null>;
  taskForm!: FormGroup;
  editMode: boolean = false;
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>,
  ) {
  }
  ngOnInit(): void {
    this.selectedTask$ = this.store.select(TaskSelectors.selectSelectedTask);
    this.taskForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])],
      dueDate: ['', [Validators.required, TaskFormValidator.dateValidator]],
      assignee: ['', Validators.required],
      status: [TaskStatus.TODO, Validators.required]
    });
    this.selectedTask$.pipe(takeUntil(this.destroy$)).subscribe((task) => {
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
        this.store.dispatch(TaskActions.updateTask({task: {...this.taskForm.value}}));
      } else {
        this.store.dispatch(TaskActions.createTask({task: {...this.taskForm.value}}));
      }
      this.store.dispatch(TaskActions.selectTask({ id: null }));
      this.dialogRef.close();
    }
  }
  ngOnDestroy() {
    this.store.dispatch(TaskActions.selectTask({ id: null }));
    this.destroy$.next();
    this.destroy$.complete();
  }
  protected readonly TaskStatus = TaskStatus;
}

