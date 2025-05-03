import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, DoCheck} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import {Observable, Subject, takeUntil} from 'rxjs';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-request-reset-password',
  standalone: true,
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestResetPasswordComponent implements OnInit, OnDestroy, DoCheck {
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

  ngDoCheck() {
    console.log('[RequestResetPasswordComponent] CD triggered');
  }
}
