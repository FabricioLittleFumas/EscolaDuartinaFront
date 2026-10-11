import { Service } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from './model/usuario';
import { UsuarioToken } from './model/usuario-token';
import { TokenService } from './service/token-service';


@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private tokenService: TokenService) {}

  temAuthority(role: string): boolean {
    const token = this.tokenService.accessToken;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const authorities: any[] = payload.authorities || [];
      return authorities.some(a =>
        typeof a === 'string' ? a === role : a.authority === role
      );
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.isAuthenticated();
  }
}