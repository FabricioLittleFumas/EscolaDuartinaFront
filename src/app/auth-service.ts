import { Service } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from './model/usuario';
import { UsuarioToken } from './model/usuario-token';

@Service()
export class AuthService  {
  private jwtHelper = inject(JwtHelperService);
  private readonly TOKEN_KEY = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): UsuarioToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.jwtHelper.decodeToken(token) as UsuarioToken;
    } catch {
      return null;
    }
  }

  isLogado(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  getRoles(): string[] {
    return this.getUsuario()?.authorities ?? [];
  }

//   getPermissions(): string[] {
//     return this.getUsuario()?.permissions ?? [];
//   }

  temRole(role: string): boolean {
    console.log("Todas as roles");
    console.log(this.getRoles());
    console.log(this.getRoles().includes(role));
    console.log("Todas as roles");
    return this.getRoles().includes(role);
  }

  temAlgumaRole(roles: string[]): boolean {
    return roles.some(r => this.getRoles().includes(r));
  }


//   temPermissao(permission: string): boolean {
//     return this.getPermissions().includes(permission);
//   }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

getAuthorities(): string[] {
  const auths = this.getUsuario()?.authorities ?? [];
  return auths.map((a: any) => typeof a === 'string' ? a : a?.authority);
}

temAuthority(authority: string): boolean {
  return this.getAuthorities().includes(authority);
}

temAlgumaAuthority(authorities: string[]): boolean {
  return authorities.some(a => this.getAuthorities().includes(a));
}
}
