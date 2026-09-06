import { Routes } from '@angular/router';
import { Home } from './home/home';
// import { ListaAlunos } from './lista-alunos/lista-alunos';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  // { path: 'lista', component: ListaAlunos }
];
