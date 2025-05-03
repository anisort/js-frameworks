import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Task} from '../../../../core/models/task.model';
import {TaskStatus} from '../../../../core/models/status.enum';
import {TaskService} from '../../../services/task.service';
import {TaskStateService} from '../../../../core/state/task-state.service';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as TaskActions from '../../../../store/task/task.actions';
import {Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {selectRouteParams} from '../../../../store/router/router.selectors';
import {selectTaskById} from '../../../../store/task/task.selector';
import {CommonModule} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TaskStatusPipe} from '../../../pipes/task-status.pipe';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  imports: [
    CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    TaskStatusPipe,
    MatIconModule,
    RouterModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent implements OnInit, OnDestroy, DoCheck{
  task$!: Observable<Task | null>;
  destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.task$ = this.store.select(selectRouteParams).pipe(
      takeUntil(this.destroy$),
      switchMap(params => this.store.select(selectTaskById(params['id'])))
    );
  }

  updateStatus(id: string, event: MatSelectChange): void {
    const selectedValue: any = event.value;
    this.store.dispatch(TaskActions.patchTask({ id: id, changes: { status: selectedValue } }));
  }

  getStatusClass(status: TaskStatus): string {
    return `chip-${status.toLowerCase()}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngDoCheck() {
    console.log('[TaskItemComponent] CD triggered');
  }
  protected readonly TaskStatus = TaskStatus;
}

