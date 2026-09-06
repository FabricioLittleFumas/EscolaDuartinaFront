import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  standalone: true,
  selector: 'app-lista-alunos',
  imports: [TableModule,CommonModule],
  templateUrl: './lista-alunos.html',
  providers: [AlunoService],
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit {
  alunos: Aluno[] = [];
  constructor(private alunoService: AlunoService,private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.alunoService.getAlunos().subscribe(aluno =>{
    this.alunos = aluno;
    this.cdr.detectChanges();
     console.log(this.alunos);
   })
  }
  
}
