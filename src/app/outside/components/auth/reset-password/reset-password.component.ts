import {ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
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
export class ResetPasswordComponent implements OnInit, OnDestroy, DoCheck {
  form!: FormGroup;
  error$!: Observable<string | null>;
  private destroy$ = new Subject<void>();
  private token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
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

    this.store.select(AuthSelectors.selectResetPasswordSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.snackBar.open('Password has been reset!', 'Close', { duration: 5000 });
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(AuthActions.resetPassword({
      token: this.token,
      password: this.form.value.password,
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngDoCheck() {
    console.log('[ResetPasswordComponent] CD triggered');
  }
}
