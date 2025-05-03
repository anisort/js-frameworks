import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject, takeUntil} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/app.state';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';
import * as AuthActions from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  registered$!: Observable<boolean>;
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
  ) {}
  ngOnInit(): void {
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
    this.registered$ = this.store.select(AuthSelectors.selectRegistered);
    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Close', { duration: 10000, panelClass: ['error-snackbar'] });
      }
    });
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { email, password } = this.registerForm.value;
    this.store.dispatch(AuthActions.register({ email, password }));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
