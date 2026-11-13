import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url';
import { PaginaLogSystem } from '../model/log-system';

@Injectable({ providedIn: 'root' })
export class LogSystemService {
  private readonly apiUrl = `${API_BASE_URL}/logs`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 25, acao = ''): Observable<PaginaLogSystem> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('acao', acao.trim());
    return this.http.get<PaginaLogSystem>(this.apiUrl, { params });
  }
}
