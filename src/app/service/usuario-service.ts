import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';
import { API_BASE_URL } from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
private apiUrl = `${API_BASE_URL}/usuario/saveUser`;
// private apiUrl = 'http://10.0.2.2:8081/APIEscolaDuartina/usuario/saveUser';

  constructor(private http: HttpClient) { }

    createUsuario(usuario: Usuario): Observable<Usuario> {
  
      // Junta tudo no padrão yy--mm--dd

      // usuario.data_saida = dataFormatada;
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }

   
    loginUsuario(login: LoginUsuario) {
     return this.http.post<any>(
    `${API_BASE_URL}/autentica/authenticate`,
    login
  );
}
}

