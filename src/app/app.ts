import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Navegacao } from './navegacao/navegacao';
import { Aluno } from './model/aluno';





@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Navegacao, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EscolaDuartina');
}
