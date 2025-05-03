import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import * as AuthActions from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-confirm-email',
  standalone: false,
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  error$!: Observable<string | null>;
  message!: string;
  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute, private store: Store<AppState>,) {}
  ngOnInit(): void {
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.store.dispatch(AuthActions.confirmEmail({ token }));
    }
    this.store.select(AuthSelectors.selectConfirmEmailSuccess).pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        this.message = success ? 'Email confirmed' : 'Waiting for confirmation email...';
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
