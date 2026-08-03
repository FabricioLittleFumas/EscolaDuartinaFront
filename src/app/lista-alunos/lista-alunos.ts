import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lista-alunos',
  imports: [TableModule,CommonModule],
  templateUrl: './lista-alunos.html',
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit {
  constructor(){

  }
  alunos: any;
  ngOnInit(): void {
   
    // throw new Error('Method not implemented.');
    this.alunos = [{
      nome: 'aluno 1',
      unidade: 'Municipal',
      data: new Date('2026-10-20')
    },
  {
      nome: 'aluno 2',
      unidade: 'Estadual',
      data: new Date('2026-10-21')
    },
    {
      nome: 'aluno 3',
      unidade: 'Municipal',
      data: new Date('2026-10-22')
    },{
      nome: 'aluno 4',
      unidade: 'Estadual',
      data: new Date('2026-10-23')
    },{
      nome: 'aluno 5',
      unidade: 'Municipal',
      data: new Date('2026-10-24')
    },{
      nome: 'aluno 6',
      unidade: 'Estadual',
      data: new Date('2026-10-25')
    },{
      nome: 'aluno 7',
      unidade: 'Municipal',
      data: new Date('2026-10-26')
    },{
      nome: 'aluno 8',
      unidade: 'Municipal',
      data: new Date('2026-10-27')
    }
  ]
  }
  
}
