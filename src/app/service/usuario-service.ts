import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
private apiUrl = 'http://localhost:8081/APIEscolaDuartina/usuario/saveUser';

  constructor(private http: HttpClient) { }

    createUsuario(usuario: Usuario): Observable<Usuario> {
  
      // Junta tudo no padrão yy--mm--dd

      // usuario.data_saida = dataFormatada;
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    loginUsuario(login: LoginUsuario){
      return this.http.post<any>('http://localhost:8081/APIEscolaDuartina/autentica/authenticate', login);
    }
}

