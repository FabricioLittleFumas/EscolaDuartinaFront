import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';
import { API_BASE_URL } from './api-base-url';

export interface UsuarioAdmin {
  id: number;
  name: string;
  email: string;
  approved: boolean;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
private apiUrl = `${API_BASE_URL}/usuario/saveUser`;
  private readonly quantidadePendentesSubject = new BehaviorSubject<number>(0);
  readonly quantidadePendentes$ = this.quantidadePendentesSubject.asObservable();
// private apiUrl = 'http://10.0.2.2:8081/APIEscolaDuartina/usuario/saveUser';

  constructor(private http: HttpClient) { }

    createUsuario(usuario: Usuario): Observable<Usuario> {
  
      // Junta tudo no padrão yy--mm--dd

      // usuario.data_nascimento = dataFormatada;
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }

   
    loginUsuario(login: LoginUsuario) {
     return this.http.post<any>(
    `${API_BASE_URL}/autentica/authenticate`,
    login
  );
}

loginPeloModal(login: LoginUsuario) {
  return this.http.post<any>(`${API_BASE_URL}/autentica/authenticate/modal-entrar`, login);
}

listarUsuarios() {
  return this.http.get<UsuarioAdmin[]>(`${API_BASE_URL}/usuario`);
}

atualizarAprovacao(id: number, aprovado: boolean) {
  return this.http.patch<UsuarioAdmin>(`${API_BASE_URL}/usuario/${id}/aprovacao`, { aprovado });
}

listarUsuariosPendentes(aposLogin = false) {
  return this.http.get<UsuarioAdmin[]>(`${API_BASE_URL}/usuario/pendentes`, {
    params: aposLogin ? { aposLogin: true } : {},
  });
}

atualizarQuantidadePendentes(aposLogin = false): void {
  this.listarUsuariosPendentes(aposLogin).subscribe({
    next: usuarios => this.definirQuantidadePendentes(usuarios.length),
    error: () => undefined
  });
}

definirQuantidadePendentes(quantidade: number): void {
  const total = Math.max(0, quantidade);
  if (this.quantidadePendentesSubject.value !== total) {
    this.quantidadePendentesSubject.next(total);
  }
}

}

