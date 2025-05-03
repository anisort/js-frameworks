import {Inject, Injectable} from '@angular/core';
import {AppConfig, CONFIG_TOKEN} from '../../share/config/config';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {LoginResponse} from '../../share/core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              @Inject(CONFIG_TOKEN) private config: AppConfig) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.config.apiUrl}/v2/auth/login`, { email, password }).pipe(
      tap(({ token }) => this.saveToken(token))
    );
  }
  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiUrl}/v2/auth/register`, { email, password });
  }
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiUrl}/v2/auth/reset`, { email });
  }
  confirmEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiUrl}/v2/auth/confirm/${token}`, {});
  }
  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiUrl}/v2/auth/reset-password/${token}`, { password });
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  private saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
