import { Component } from '@angular/core';
import { ListaAlunos } from '../lista-alunos/lista-alunos';
import { ResumoEscola } from '../resumo-escola/resumo-escola';
import { AtalhosRapidos } from '../atalhos-rapidos/atalhos-rapidos';


@Component({
  standalone: true,
  imports: [ListaAlunos, ResumoEscola, AtalhosRapidos],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
