import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';
import { ChangeDetectorRef } from '@angular/core';
import { ModalViewAluno } from '../modal-view-aluno/modal-view-aluno';
import { RouterLink } from "@angular/router";
import { ModalEditAluno } from '../modal-edit-aluno/modal-edit-aluno';


@Component({
  standalone: true,
  selector: 'app-lista-alunos',
  imports: [TableModule, CommonModule, ModalViewAluno, RouterLink, ModalEditAluno],
  templateUrl: './lista-alunos.html',
  providers: [AlunoService],
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit {
  @ViewChild('modalViewAluno') modalEntrar!: ModalViewAluno;
  @ViewChild('modalEditAluno') modalEdit!: ModalEditAluno;

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
