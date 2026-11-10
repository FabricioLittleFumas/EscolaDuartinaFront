import { Component } from '@angular/core';
import { ListaAlunos } from '../lista-alunos/lista-alunos';
import { ResumoEscola } from '../resumo-escola/resumo-escola';
import { AtalhosRapidos } from '../atalhos-rapidos/atalhos-rapidos';
import { LandingPage } from '../landing-page/landing-page';


@Component({
  standalone: true,
  imports: [ListaAlunos, ResumoEscola, AtalhosRapidos, LandingPage],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
