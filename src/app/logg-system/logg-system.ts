import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { LogSystemService } from '../service/log-system-service';
import { LogSystem } from '../model/log-system';

@Component({
  selector: 'app-logg-system',
  standalone: true,
  imports: [CommonModule, DatePipe, TableModule, InputTextModule],
  templateUrl: './logg-system.html',
  styleUrl: './logg-system.css'
})
export class LoggSystem implements OnInit, OnDestroy {
  logs: LogSystem[] = [];
  first = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  carregando = false;
  erro = '';
  termoAcao = '';
  private readonly buscaAcao$ = new Subject<string>();
  private readonly buscaSubscription: Subscription;

  constructor(private logService: LogSystemService, private cdr: ChangeDetectorRef) {
    this.buscaSubscription = this.buscaAcao$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.first = 0;
      this.carregarPagina(0, this.pageSize);
    });
  }

  ngOnInit(): void {
    this.carregarPagina(0, this.pageSize);
  }

  ngOnDestroy(): void {
    this.buscaSubscription.unsubscribe();
  }

  onBuscarAcao(valor: string): void {
    this.termoAcao = valor;
    this.buscaAcao$.next(valor);
  }

  onLazyLoad(event: { first?: number | null; rows?: number | null }): void {
    const first = event.first ?? this.first;
    const size = event.rows ?? this.pageSize;
    this.first = first;
    this.pageSize = size;
    this.carregarPagina(Math.floor(first / size), size);
  }

  private carregarPagina(page: number, size: number): void {
    this.carregando = true;
    this.erro = '';
    this.logService.listar(page, size, this.termoAcao).subscribe({
      next: resposta => {
        this.logs = resposta.content;
        this.first = resposta.page * size;
        this.totalElements = resposta.totalElements;
        this.totalPages = resposta.totalPages;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.logs = [];
        this.carregando = false;
        this.erro = `Não foi possível carregar os logs (HTTP ${error.status || 'sem conexão'}).`;
        this.cdr.detectChanges();
      },
      complete: () => this.cdr.detectChanges()
    });
  }
}
