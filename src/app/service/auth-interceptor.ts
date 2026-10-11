import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TokenService } from './token-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adiciona token em tudo, menos nas rotas de autenticação
    if (!req.url.includes('/autentica/')) {
      const token = this.tokenService.accessToken;
      if (token) {
        req = this.addToken(req, token);
      }
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (req.url.includes('/autentica/refresh')) {
            this.tokenService.clearTokens();
            this.router.navigate(['/']);
            return throwError(() => error);
          }
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenService.isRefreshingToken) {
      this.tokenService.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      return this.tokenService.refreshAccessToken().pipe(
        switchMap((tokens) => {
          this.tokenService.isRefreshingToken = false;
          this.refreshTokenSubject.next(tokens.accessToken);
          return next.handle(this.addToken(req, tokens.accessToken));
        }),
        catchError(err => {
          this.tokenService.isRefreshingToken = false;
          this.tokenService.clearTokens();
          this.router.navigate(['/']);
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}