import { Service } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from './model/usuario';
import { UsuarioToken } from './model/usuario-token';
import { TokenService } from './service/token-service';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {

 // Emite sempre que login/logout/refresh acontecer
  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authStateSubject.asObservable();

  constructor(private tokenService: TokenService) {
    // Estado inicial: qualquer perfil com token válido está autenticado.
    this.authStateSubject.next(this.isLoggedIn());
  }

  // Chame depois de setTokens()
  notificarLogin(): void {
    this.authStateSubject.next(this.isLoggedIn());
  }

  // Chame depois de clearTokens()
  notificarLogout(): void {
    this.authStateSubject.next(false);
  }

  temAuthority(role: string): boolean {
    const token = this.tokenService.accessToken;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.tokenService.clearTokens();
        return false;
      }
      const authorities: any[] = payload.authorities || [];
      return authorities.some(a =>
        typeof a === 'string' ? a === role : a.authority === role
      );
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.accessToken;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.tokenService.clearTokens();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
