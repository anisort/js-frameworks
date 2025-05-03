import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit, signal,
  ViewChild, WritableSignal
} from '@angular/core';
import { Task } from '../../../../core/models/task.model';
import {TaskStatus} from '../../../../core/models/status.enum';
import {TaskService} from '../../../services/task.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged, filter,
  map,
  Observable,
  startWith,
  Subject,
  switchMap, take,
  takeUntil, tap,
} from 'rxjs';
import {TaskStateService} from '../../../../core/state/task-state.service';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as TaskActions from '../../../../store/task/task.actions';
import * as TaskSelectors from '../../../../store/task/task.selector';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TaskStatusPipe} from '../../../pipes/task-status.pipe';


@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    TaskStatusPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  displayedColumns: string[] = ['title', 'description', 'assignee', 'dueDate', 'status', 'actions'];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  destroy$ = new Subject<void>();
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  totalTasks$!: Observable<number>;
  tasks$!: Observable<Task[]>;
  hasLoading: WritableSignal<boolean> = signal(false);
  filterControl = new FormControl('');
  statusControl = new FormControl('');

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.loadTasks(1, 5);
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
    this.loading$ = this.store.select(TaskSelectors.selectTaskLoading);
    this.error$ = this.store.select(TaskSelectors.selectTaskError);
    this.totalTasks$ = this.store.select(TaskSelectors.selectTaskTotal);
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.paginator.firstPage();
    });
    this.statusControl.valueChanges.subscribe(() => {
      this.paginator.firstPage();
    });
    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { duration: 4000, panelClass: ['error-snackbar'] });
      }
    });
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.hasLoading.set(loading);
    })
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(
      startWith({ pageIndex: 0, pageSize: 5 }),
      switchMap(({ pageIndex, pageSize }) =>
        combineLatest([
          this.filterControl.valueChanges.pipe(startWith(this.filterControl.value)),
          this.statusControl.valueChanges.pipe(startWith(this.statusControl.value))
        ]).pipe(
          takeUntil(this.destroy$),
          tap(([filter, status]) => {
            this.loadTasks(pageIndex + 1, pageSize, filter ?? '', status ?? '');
          })
        )
      )
    ).subscribe();
  }

  ngDoCheck(): void {
    console.log('[TaskListComponent] CD triggered');
  }

  openDialog() : void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });
    dialogRef.afterClosed().pipe(
      filter(result => result === 'created'),
    ).subscribe(() => {
      this.goToLastPage();
    });
  }

  viewTask(id: string): void {
    this.router.navigate([{ outlets: { primary: ['workbench', 'tasks', 'view', id], aside: null } }]);
  }

  editTask(id: string): void {
    this.store.dispatch(TaskActions.selectTask({id}));
    this.openDialog();
  }

  deleteTask(id: string): void {
    this.store.dispatch(TaskActions.deleteTask({id}));
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      const isLastItemOnPage = tasks.length === 1;
      const currentPage = this.paginator.pageIndex + 1;
      const goToPage = isLastItemOnPage && currentPage > 1
        ? currentPage - 1
        : currentPage;
      this.loadTasks(
        goToPage,
        this.paginator.pageSize,
        this.filterControl.value ?? '',
        this.statusControl.value ?? ''
      );
      this.paginator.pageIndex = goToPage - 1;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly TaskStatus = TaskStatus;

  private loadTasks(page: number, pageSize: number, filter = '', status = ''): void {
    this.store.dispatch(TaskActions.loadTasks({ page, pageSize, filter, status }));
  }

  private goToLastPage(): void {
    this.totalTasks$.pipe(take(1)).subscribe(total => {
      const lastPage = Math.ceil((total + 1) / this.paginator.pageSize);
      this.paginator.pageIndex = lastPage - 1;
      this.cdr.markForCheck();
      this.loadTasks(
        lastPage,
        this.paginator.pageSize,
        this.filterControl.value ?? '',
        this.statusControl.value ?? ''
      );
    });
  }
  onSelected(event: MatSelectChange): void {
    this.store.dispatch(TaskActions.setFilterStatus({status: event.value}))
  }
}



