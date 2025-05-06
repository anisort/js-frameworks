import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
  WritableSignal
} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import * as AuthActions from '../../../../store/auth/auth.actions';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent implements OnInit, OnDestroy, DoCheck {

  error$!: Observable<string | null>;
  message!: WritableSignal<string>;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<AppState>, private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
    const token = this.route.snapshot.paramMap.get('token');

    if (token) {
      this.store.dispatch(AuthActions.confirmEmail({ token }));
    }

    this.store.select(AuthSelectors.selectConfirmEmailSuccess).pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        this.message.set(success ? 'Email confirmed' : 'Waiting for confirmation email...');
        //this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngDoCheck() {
    console.log('[ConfirmEmailComponent] CD triggered');
  }
}
