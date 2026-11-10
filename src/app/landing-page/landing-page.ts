import { Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { criarContagemAnimada } from '../contagem-animada';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  readonly incorporada = input(false);
  readonly totalLitros = 658;

  private readonly contador = viewChild.required<ElementRef<HTMLElement>>('contador');
  readonly litrosExibidos = criarContagemAnimada(this.contador, () => this.totalLitros);
}
