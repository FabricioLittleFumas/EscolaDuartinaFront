import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';
import { Aluno } from '../model/aluno';
import { API_BASE_URL } from './api-base-url';

export interface PaginaAlunos {
  content: Aluno[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface ConsultaAlunos {
  page: number;
  size: number;
  sort: string;
  direction: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = `${API_BASE_URL}/alunos`;
  // private apiUrl = 'http://10.0.2.2:8081/APIEscolaDuartina/alunos/';
  private consultaSubject = new BehaviorSubject<ConsultaAlunos>({
    page: 0,
    size: 10,
    sort: 'nome',
    direction: 'ASC',
    nome: ''
  });
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private requestId = 0;

  readonly loading$ = this.loadingSubject.asObservable();

  readonly paginaAlunos$ = this.consultaSubject.pipe(
    switchMap(consulta => {
      const requestId = ++this.requestId;
      this.loadingSubject.next(true);
      return this.http.get<PaginaAlunos>(`${this.apiUrl}/paginado`, {
        params: {
          page: consulta.page,
          size: consulta.size,
          sort: consulta.sort,
          direction: consulta.direction,
          nome: consulta.nome
        }
      }).pipe(
        catchError(error => {
          console.error('Falha ao carregar página de alunos:', error);
          return of({
            content: [],
            page: consulta.page,
            size: consulta.size,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          } as PaginaAlunos);
        }),
        finalize(() => {
          if (requestId === this.requestId) {
            this.loadingSubject.next(false);
          }
        })
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient) { }

  // Buscar todos os alunos
  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
  }

  buscarPorNome(nome: string): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.apiUrl}/buscar`, {
      params: { nome: nome.trim() }
    });
  }

  definirTermoBusca(termo: string): void {
    const atual = this.consultaSubject.value;
    const novoTermo = (termo ?? '').trim();
    if (novoTermo !== atual.nome) {
      this.consultaSubject.next({ ...atual, page: 0, nome: novoTermo });
    }
  }

  definirPagina(page: number, size: number, sort?: string, direction?: string): void {
    const atual = this.consultaSubject.value;
    const proxima: ConsultaAlunos = {
      ...atual,
      page: Math.max(0, page),
      size: Math.min(Math.max(1, size), 100),
      sort: sort || atual.sort,
      direction: direction || atual.direction
    };

    if (JSON.stringify(proxima) !== JSON.stringify(atual)) {
      this.consultaSubject.next(proxima);
    }
  }

  recarregarLista(): void {
    this.consultaSubject.next({ ...this.consultaSubject.value });
  }

  // Buscar aluno por ID
  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`);
  }

  // Criar novo aluno
  createAluno(aluno: Aluno): Observable<Aluno> {

    // Junta tudo no padrão yy--mm--dd
    console.log("Data formatada");
    console.log(aluno.data_saida);
    // aluno.data_saida = dataFormatada;
    return this.http.post<Aluno>(this.apiUrl, aluno);
  }

  // Atualizar aluno
  updateAluno(id: number, aluno: Aluno): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, aluno);
  }

  // Deletar aluno
  deleteAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
