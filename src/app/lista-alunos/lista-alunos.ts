import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AuthService } from '../auth-service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-lista-alunos',
  imports: [ToastModule, TableModule, CommonModule, ModalViewAluno, ModalEditAluno,ModalExcludeAluno,ModalInsertAluno],
templateUrl: './lista-alunos.html',
  providers: [MessageService],
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit, OnDestroy {
  @ViewChild('modalViewAluno') modalEntrar!: ModalViewAluno;
  @ViewChild('modalEditAluno') modalEdit!: ModalEditAluno;
 @ViewChild('modalExcludeAluno') modalExcludeAluno!: ModalExcludeAluno;
 @ViewChild('modalInsertAluno') modalInsertAluno!: ModalInsertAluno;
  private authSub!: Subscription;
  private alunosSub!: Subscription;
  alunos: Aluno[] = [];
  hasAutority: boolean | undefined;
  constructor(
    private authService: AuthService,
    private alunoService: AlunoService,
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
     this.alunoService.recarregarLista();
  }

  ngOnInit(): void {
   this.alunosSub = this.alunoService.alunos$.subscribe(alunos => {
      this.alunos = alunos;
      this.cdr.detectChanges();
   });
   this.hasAutority = this.authService.temAuthority('USER');
   this.authSub = this.authService.authState$.subscribe(() => {
      this.hasAutority = this.authService.temAuthority('USER');
      this.getAllAlunos();   // recarrega a lista
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.alunosSub?.unsubscribe();
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
