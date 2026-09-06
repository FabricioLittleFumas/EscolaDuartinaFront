import { Component } from '@angular/core';
import { ListaAlunos } from '../lista-alunos/lista-alunos';


@Component({
  standalone: true,
  imports: [ListaAlunos],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}