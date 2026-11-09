import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-atalhos-rapidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './atalhos-rapidos.html',
  styleUrl: './atalhos-rapidos.css'
})
export class AtalhosRapidos implements OnInit, OnDestroy {
  isAdmin = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.atualizarPermissoes();
    this.authSubscription = this.authService.authState$.subscribe(() => this.atualizarPermissoes());
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private atualizarPermissoes(): void {
    this.isAdmin = this.authService.temAuthority('ADMIN');
    this.cdr.markForCheck();
  }
}
