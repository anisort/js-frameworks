import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, signal,
  SimpleChanges, WritableSignal
} from '@angular/core';
import {Task} from '../../../../core/models/task.model';
import {TaskStatus} from '../../../../core/models/status.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {TaskFormValidator} from '../../../validators/task-form.validator';
import {filter, Observable, Subject, take, takeUntil} from 'rxjs';
import {TaskStateService} from '../../../../core/state/task-state.service';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as TaskActions from '../../../../store/task/task.actions';
import * as TaskSelectors from '../../../../store/task/task.selector';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit, OnDestroy, DoCheck {
  destroy$ = new Subject<void>();
  selectedTask$!: Observable<Task | null>;
  taskForm!: FormGroup;
  editMode: WritableSignal<boolean> = signal(false);
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
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
      assignee: [''],
      status: [TaskStatus.TODO, Validators.required]
    });
    this.selectedTask$.pipe(takeUntil(this.destroy$)).subscribe((task) => {
      if (task) {
        this.taskForm.patchValue(task);
        this.editMode.set(true);
      } else {
        this.taskForm.reset({status: TaskStatus.TODO});
        this.editMode.set(false);
      }
    })
  }
  ngDoCheck(): void {
    console.log('[TaskFormComponent] CD triggered');
  }
  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.editMode()) {
        this.store.dispatch(TaskActions.updateTask({task: {...this.taskForm.value}}));
      } else {
        this.store.dispatch(TaskActions.createTask({task: {...this.taskForm.value}}));
      }
      this.store.select(TaskSelectors.selectTaskLoading)
        .pipe(
          filter(isLoading => !isLoading),
          take(1)
        )
        .subscribe(() => {
          this.store.select(TaskSelectors.selectTaskError)
            .pipe(take(1))
            .subscribe(error => {
              if (!error) {
                this.dialogRef.close(this.editMode() ? 'updated' : 'created');
                this.store.dispatch(TaskActions.selectTask({ id: null }));
              }
            });
        });
    }
  }
  ngOnDestroy() {
    this.store.dispatch(TaskActions.selectTask({ id: null }));
    this.destroy$.next();
    this.destroy$.complete();
  }
  protected readonly TaskStatus = TaskStatus;
}

