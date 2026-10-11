import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class TokenService {

  private apiUrl = 'http://localhost:8081/APIEscolaDuartina/autentica';

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  isRefreshingToken = false;

  constructor(private http: HttpClient) {
    this.carregarTokensDoStorage();
  }

  get accessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  get refreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  setTokens(tokens: TokenResponse): void {
    this.accessTokenSubject.next(tokens.accessToken);
    this.refreshTokenSubject.next(tokens.refreshToken);
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }

  refreshAccessToken(): Observable<TokenResponse> {
    this.isRefreshingToken = true;
    const refresh = this.refreshToken;

    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, { refreshToken: refresh })
      .pipe(
        tap(tokens => {
          this.setTokens(tokens);
          this.isRefreshingToken = false;
        })
      );
  }

  clearTokens(): void {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_token'); // limpa o antigo, se existir
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private carregarTokensDoStorage(): void {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    if (access) this.accessTokenSubject.next(access);
    if (refresh) this.refreshTokenSubject.next(refresh);
  }
}