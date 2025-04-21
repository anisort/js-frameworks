import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {selectUrl} from './store/router/router.selectors';
import {filter, map, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-course';
  isTasksRoute$!: Observable<boolean>;


  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.isTasksRoute$ = this.store.select(selectUrl).pipe(
      filter(url => !!url),
      map(url => url.startsWith('/tasks(aside:stats)')),
    )
  }
}
