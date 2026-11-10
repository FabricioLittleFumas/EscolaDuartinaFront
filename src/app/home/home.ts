import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service';
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
export class Home implements OnInit, OnDestroy {
  hasUserAccess = false;
  isAdmin = false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.atualizarAutorizacao();
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.atualizarAutorizacao();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private atualizarAutorizacao(): void {
    this.hasUserAccess = this.authService.isLoggedIn() && this.authService.temAuthority('USER');
    this.isAdmin = this.authService.isLoggedIn() && this.authService.temAuthority('ADMIN');
  }
}
