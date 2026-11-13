import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AutorizacaoUsuario } from './autorizacao-usuario/autorizacao-usuario';
import { LoggSystem } from './logg-system/logg-system';
import { podeAcessarLogSystem } from './service/log-system.guard';
import { ListaUsuarios } from './lista-usuarios/lista-usuarios';
// import { ListaAlunos } from './lista-alunos/lista-alunos';

export const routes: Routes = [
  {
    path: 'leitura-pdf',
    title: 'Biblioteca em ?udio',
    canActivate: [() => inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/home'])],
    loadComponent: () => import('./pdf-leitor/pdf-leitor').then(module => module.PdfLeitor),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'historia',
    title: 'História da EMEF José Sabbag | Duartina',
    loadComponent: () => import('./landing-page/landing-page').then(({ LandingPage }) => LandingPage),
  },
  { path: 'autorizacao-usuario', component: AutorizacaoUsuario },
  { path: 'usuarios', component: ListaUsuarios, canActivate: [() => inject(AuthService).temAuthority('ADMIN') || inject(Router).createUrlTree(['/home'])] },
  { path: 'log-system', component: LoggSystem, canActivate: [podeAcessarLogSystem] },
  // { path: 'lista', component: ListaAlunos }
];
