import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AutorizacaoUsuario } from './autorizacao-usuario/autorizacao-usuario';
// import { ListaAlunos } from './lista-alunos/lista-alunos';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'autorizacao-usuario', component: AutorizacaoUsuario },
  // { path: 'lista', component: ListaAlunos }
];
