import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { criarContagemAnimada } from '../contagem-animada';
import { AlunoService } from '../service/aluno-service';
import { IlustracaoEscola } from './ilustracao-escola';

@Component({
  selector: 'app-resumo-escola',
  standalone: true,
  imports: [RouterLink, IlustracaoEscola],
  templateUrl: './resumo-escola.html',
  styleUrl: './resumo-escola.css'
})
export class ResumoEscola {
  private readonly contador = viewChild.required<ElementRef<HTMLElement>>('contador');
  readonly totalAlunos = toSignal(inject(AlunoService).paginaAlunos$.pipe(map(pagina => pagina.totalElements)), {
    initialValue: null,
  });
  readonly alunosExibidos = criarContagemAnimada(this.contador, this.totalAlunos);
}
