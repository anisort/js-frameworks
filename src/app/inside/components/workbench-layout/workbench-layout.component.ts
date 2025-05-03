import {ChangeDetectionStrategy, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {filter, map, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.state';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-workbench-layout',
  standalone: true,
  templateUrl: './workbench-layout.component.html',
  styleUrl: './workbench-layout.component.scss',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchLayoutComponent implements OnInit, DoCheck {
  @ViewChild('drawer') drawer!: MatSidenav;

  isNamedOutlet$!: Observable<boolean>;

  constructor(private store: Store<AppState>, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isNamedOutlet$ = this.store.select((state) => state.router.state.url).pipe(
      filter((url) => !!url),
      map((url: string) => url.startsWith('/workbench/(tasks/list//aside:stats)'))
    );
  }

  ngDoCheck() {
    console.log('[WorkbenchLayoutComponent] CD triggered');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
