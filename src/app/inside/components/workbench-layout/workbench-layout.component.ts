import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {filter, map, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {selectUrl} from '../../../store/router/router.selectors';
import {AuthService} from '../../../outside/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-workbench-layout',
  standalone: false,
  templateUrl: './workbench-layout.component.html',
  styleUrl: './workbench-layout.component.scss'
})
export class WorkbenchLayoutComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isNamedOutlet$!: Observable<boolean>;

  constructor(private store: Store<AppState>, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isNamedOutlet$ = this.store.select((state) => state.router.state.url).pipe(
      filter((url) => !!url),
      map((url: string) => url.startsWith('/workbench/(tasks/list//aside:stats)'))
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
