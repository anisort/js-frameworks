import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Task } from '../../core/models/task.model';
import {tasks} from '../../core/moc_data/tasks';
import {TaskStatus} from '../../core/models/status.enum';
import {TaskService} from '../../services/task.service';
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
import {TaskStateService} from '../../share/state/task-state.service';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';
import {MatSelectChange} from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selector';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';


@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['title', 'description', 'assignee', 'dueDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  destroy$ = new Subject<void>();
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  totalTasks$!: Observable<number>;

  tasks$!: Observable<Task[]>;

  hasLoading: boolean = false;

  filterControl = new FormControl('');
  statusControl = new FormControl('');

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

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
      this.paginator.firstPage()
    });

    this.statusControl.valueChanges.subscribe(() => {
      this.paginator.firstPage()
    });

    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { duration: 4000, panelClass: ['error-snackbar'] });
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.hasLoading = loading;
    });
  }

  ngAfterViewInit(): void {
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


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });

    dialogRef.afterClosed().pipe(
      filter(result => result === 'created'),
    ).subscribe(() => {
      this.goToLastPage();
    })
  }

  viewTask(id: string): void {
    this.router.navigate([{ outlets: { primary: ['tasks', 'view', id], aside: null } }]);
  }

  editTask(id: string): void {
    this.store.dispatch(TaskActions.selectTask({ id }));
    this.openDialog();
  }

  deleteTask(id: string): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
    this.tasks$.pipe(take(1)).subscribe((tasks: Task[]) => {
      const isLastItemOnPage: boolean = tasks.length === 1;
      const currentPage: number = this.paginator.pageIndex + 1;

      const goToPage: number = isLastItemOnPage && currentPage > 1
        ? currentPage - 1
        : currentPage;

      this.loadTasks(
        goToPage,
        this.paginator.pageSize,
        this.filterControl.value ?? '',
        this.statusControl.value ?? ''
      );

      this.paginator.pageIndex = goToPage - 1;
    });
  }


  onSelected(event: MatSelectChange): void {
    this.store.dispatch(TaskActions.setFilterStatus({status: event.value}))
  }

  private loadTasks(page: number, pageSize: number, filter = '', status = ''): void {
    this.store.dispatch(TaskActions.loadTasks({page, pageSize, filter, status}));
  }

  private goToLastPage(): void {
    this.totalTasks$.pipe(take(1)).subscribe((total: number) => {
      const lastPage: number = Math.ceil((total + 1) / this.paginator.pageSize);
      this.paginator.pageIndex = lastPage - 1;

      this.loadTasks(
        lastPage,
        this.paginator.pageSize,
        this.filterControl.value ?? '',
        this.statusControl.value ?? ''
      );
    });
  }

  protected readonly TaskStatus = TaskStatus;
}


