import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUser, LoginRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'ghms_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(request: LoginRequest, rememberMe: boolean): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${environment.apiBaseUrl}/auth/login`, request).pipe(
      tap((user) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
