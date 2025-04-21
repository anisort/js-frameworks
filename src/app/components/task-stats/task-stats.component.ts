import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.state';
import {selectTasksByStatus, selectTaskTotal} from '../../store/task/task.selector';
import {TaskStatus} from '../../core/models/status.enum';

@Component({
  selector: 'app-task-stats',
  standalone: false,
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.scss'
})
export class TaskStatsComponent implements OnInit {
  total$!: Observable<number>;
  countTodo$!: Observable<number>;
  countInProgress$!: Observable<number>;
  countDone$!: Observable<number>;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.total$ = this.store.select(selectTaskTotal);
    this.countTodo$ = this.store.select(selectTasksByStatus(TaskStatus.TODO));
    this.countInProgress$ = this.store.select(selectTasksByStatus(TaskStatus.IN_PROGRESS));
    this.countDone$ = this.store.select(selectTasksByStatus(TaskStatus.DONE));
  }
}
