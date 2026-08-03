import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacao } from './navegacao/navegacao';
import { ListaAlunos } from './lista-alunos/lista-alunos';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navegacao, ListaAlunos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EscolaDuartina');
}
