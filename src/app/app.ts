import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacao } from './navegacao/navegacao';





@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet,Navegacao],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EscolaDuartina');
}
