import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { Aluno } from '../model/aluno';
import { API_BASE_URL } from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = `${API_BASE_URL}/alunos`;
  // private apiUrl = 'http://10.0.2.2:8081/APIEscolaDuartina/alunos/';
  private termoBuscaSubject = new BehaviorSubject<string>('');
  private recarregarSubject = new Subject<void>();

  readonly alunos$ = combineLatest([
    this.termoBuscaSubject.pipe(debounceTime(250), distinctUntilChanged()),
    this.recarregarSubject.pipe(startWith(undefined))
  ]).pipe(
    switchMap(([termo]) => {
      const nome = termo.trim();
      const consulta = nome ? this.buscarPorNome(nome) : this.getAlunos();
      return consulta.pipe(
        catchError(error => {
          console.error('Falha ao carregar alunos:', error);
          return of([] as Aluno[]);
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
    this.termoBuscaSubject.next(termo ?? '');
  }

  recarregarLista(): void {
    this.recarregarSubject.next();
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
