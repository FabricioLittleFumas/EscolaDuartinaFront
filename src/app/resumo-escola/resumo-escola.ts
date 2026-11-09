import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlunoService } from '../service/aluno-service';

@Component({
  selector: 'app-resumo-escola',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resumo-escola.html',
  styleUrl: './resumo-escola.css'
})
export class ResumoEscola implements OnInit, OnDestroy {
  totalAlunos = 0;
  carregando = true;
  private paginaSubscription?: Subscription;

  constructor(private alunoService: AlunoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.paginaSubscription = this.alunoService.paginaAlunos$.subscribe(pagina => {
      this.totalAlunos = pagina.totalElements;
      this.carregando = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.paginaSubscription?.unsubscribe();
  }
}
