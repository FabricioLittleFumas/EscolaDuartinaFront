import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AutorizacaoUsuario } from './autorizacao-usuario/autorizacao-usuario';
import { LoggSystem } from './logg-system/logg-system';
import { podeAcessarLogSystem } from './service/log-system.guard';
// import { ListaAlunos } from './lista-alunos/lista-alunos';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'historia',
    title: 'História da EMEF José Sabbag | Duartina',
    loadComponent: () => import('./landing-page/landing-page').then(({ LandingPage }) => LandingPage),
  },
  { path: 'autorizacao-usuario', component: AutorizacaoUsuario },
  { path: 'log-system', component: LoggSystem, canActivate: [podeAcessarLogSystem] },
  // { path: 'lista', component: ListaAlunos }
];
