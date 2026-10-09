import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';
import { ChangeDetectorRef } from '@angular/core';
import { ModalViewAluno } from '../modal-view-aluno/modal-view-aluno';
import { RouterLink } from "@angular/router";
import { ModalEditAluno } from '../modal-edit-aluno/modal-edit-aluno';
import { ModalExcludeAluno } from '../modal-exclude-aluno/modal-exclude-aluno';
import { ModalInsertAluno } from '../modal-insert-aluno/modal-insert-aluno';
import { HttpHeaders } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-lista-alunos',
  imports: [ToastModule, TableModule, CommonModule, ModalViewAluno, RouterLink, ModalEditAluno,ModalExcludeAluno,ModalInsertAluno],
templateUrl: './lista-alunos.html',
  providers: [AlunoService, MessageService],
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit {
  @ViewChild('modalViewAluno') modalEntrar!: ModalViewAluno;
  @ViewChild('modalEditAluno') modalEdit!: ModalEditAluno;
 @ViewChild('modalExcludeAluno') modalExcludeAluno!: ModalExcludeAluno;
 @ViewChild('modalInsertAluno') modalInsertAluno!: ModalInsertAluno;

  alunos: Aluno[] = [];
  constructor(private alunoService: AlunoService,
    private cdr: ChangeDetectorRef
  , private messageService: MessageService){
  }



  excluir(event: any){
    console.log("evento vindo do excluir aluno");
    console.log(event.id);
    this.alunoService.deleteAluno(event.id).subscribe((next) =>{
      this.modalExcludeAluno.closeDialog();
      this.getAllAlunos();
      this.cdr.detectChanges();
      this.mostrarToast("success","Sucesso ao excluir aluno.", "Sucesso");
    });
  }

emitAlunoAtt(aluno: any){
    console.log("alunoo do edit edit aluno");
    console.log(aluno.id);
    console.log(aluno);
    
    this.alunoService.updateAluno(aluno.id,aluno).subscribe((next) =>{
      this.getAllAlunos();
      this.cdr.detectChanges();
      this.modalEdit.closeDialog();
      this.mostrarToast("success","Sucesso ao atualizar aluno.", "Sucesso");
    },
    (error) =>{
        this.mostrarToast("error",error.error.message, "Erro");
    }
  )
  }
  insertAluno(aluno: any){
    console.log("alunoo do inserir aluno");
    console.log(aluno);
    this.alunoService.createAluno(aluno).subscribe((next) =>{
      this.cdr.detectChanges();
      this.getAllAlunos();
      this.modalInsertAluno.closeDialogs();
      this.mostrarToast("success","Sucesso ao inserir aluno.", "Sucesso");
    },
    (error) => {
      console.log("aconteceu um erro ao inserir aluno");
      console.log(error);
      this.mostrarToast("error",error.error.message, "Erro");
    }
  )
  }

  getAllAlunos(){
     this.alunoService.getAlunos().subscribe(next => {
     this.alunos = next;
     this.cdr.detectChanges();
     console.log(this.alunos);
   })
  }

  ngOnInit(): void {
   this.getAllAlunos();
  }
  mostrarToast(severidade: string, detalhe: string, sumario: string ){
  this.messageService.add({ 
      severity: severidade, 
      summary: sumario, 
      detail: detalhe,
      sticky: false
    });
  }
  
}
