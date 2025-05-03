import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {Observable, Subject, takeUntil} from 'rxjs';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-reset-password',
  standalone: false,
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.scss',
})
export class RequestResetPasswordComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  error$!: Observable<string | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.error$ = this.store.select(AuthSelectors.selectAuthError);

    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.snackBar.open(error, 'Close', {
            duration: 10000,
            panelClass: ['error-snackbar'],
          });
        }
      });

    this.store.select(AuthSelectors.selectPasswordResetEmailSent)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sent => {
        if (sent) {
          this.snackBar.open('Reset email sent!', 'Close', { duration: 5000 });
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(AuthActions.requestResetPassword({ email: this.form.value.email }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
