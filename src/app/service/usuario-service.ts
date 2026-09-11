import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
private apiUrl = 'http://localhost:8081/APIEscolaDuartina/usuario/saveUser';

  constructor(private http: HttpClient) { }

    createAluno(usuario: Usuario): Observable<Usuario> {
  
      // Junta tudo no padrão yy--mm--dd

      // usuario.data_saida = dataFormatada;
      return this.http.post<Usuario>(this.apiUrl, usuario);
    }
}

