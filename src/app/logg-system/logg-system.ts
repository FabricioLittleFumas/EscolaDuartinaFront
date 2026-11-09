import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { LogSystemService } from '../service/log-system-service';
import { LogSystem } from '../model/log-system';

@Component({
  selector: 'app-logg-system',
  standalone: true,
  imports: [CommonModule, DatePipe, TableModule],
  templateUrl: './logg-system.html',
  styleUrl: './logg-system.css'
})
export class LoggSystem {
  logs: LogSystem[] = [];
  first = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  carregando = false;
  erro = '';

  constructor(private logService: LogSystemService, private cdr: ChangeDetectorRef) {}

  onLazyLoad(event: { first?: number | null; rows?: number | null }): void {
    const first = event.first ?? this.first;
    const size = event.rows ?? this.pageSize;
    this.first = first;
    this.pageSize = size;
    this.carregando = true;
    this.erro = '';
    this.logService.listar(Math.floor(first / size), size).subscribe({
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
