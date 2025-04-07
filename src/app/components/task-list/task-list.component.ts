import {Component, OnDestroy, OnInit} from '@angular/core';
import { Task } from '../../core/models/task.model';
import {tasks} from '../../core/moc_data/tasks';
import {TaskStatus} from '../../core/models/status.enum';
import {TaskService} from '../../services/task.service';
import {combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith, Subject, takeUntil,} from 'rxjs';
import {TaskStateService} from '../../share/state/task-state.service';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';
import {MatSelectChange} from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();
  myTasks$!: Observable<Task[]>;
  hasLoading: boolean = false;
  filterControl = new FormControl('');

  protected readonly TaskStatus = TaskStatus;

  constructor(
    private taskStateService: TaskStateService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.taskStateService.loadTasks();

    this.myTasks$ = combineLatest([
      this.taskStateService.task$,
      this.filterControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([tasks, filter]) =>
        tasks.filter(task =>
          task.title.toLowerCase().includes(filter ?? ''.toLowerCase()) ||
          task.description?.toLowerCase().includes(filter ?? ''.toLowerCase()) ||
          task.assignee.toLowerCase().includes(filter ?? ''.toLowerCase())
        )
      )
    );

    this.taskStateService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { duration: 4000, panelClass: ['error-snackbar'] });
      }
    });

    this.taskStateService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading: boolean) => {
      this.hasLoading = loading;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(): void {
    this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });
  }

  editTask(task: Task): void {
    this.taskStateService.selectTask(task);
    this.openDialog();
  }


  onSelected(event: MatSelectChange): void {
    this.taskStateService.loadTasks(event.value);
  }

}


