import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SortIcon, TableModule } from 'primeng/table';
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
import { NgxLoadingModule } from 'ngx-loading';
import { ButtonModule } from 'primeng/button';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { mensagemErroApi } from '../utils/http-error-message';

@Component({
  standalone: true,
  selector: 'app-lista-alunos',
  imports: [ToastModule, TableModule, SortIcon, ButtonModule, CommonModule, NgxLoadingModule, CapitalizePipe, ModalViewAluno, ModalEditAluno,ModalExcludeAluno,ModalInsertAluno],
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
  totalRecords = 0;
  pageSize = 10;
  first = 0;
  hasAutority: boolean | undefined;
  constructor(
    private authService: AuthService,
    private alunoService: AlunoService,
    private cdr: ChangeDetectorRef
  , private messageService: MessageService){
  }

  get loading$() {
    return this.alunoService.loading$;
  }



  excluir(event: any){
    this.modalExcludeAluno.salvando = true;
    this.modalExcludeAluno.erro = '';
    this.alunoService.deleteAluno(event.id).subscribe({
      next: () => {
        this.modalExcludeAluno.salvando = false;
        this.modalExcludeAluno.closeAfterDelete();
        this.getAllAlunos();
        this.cdr.detectChanges();
        this.mostrarToast('success', `O aluno ${event.nome} (RM ${event.rm ?? 'não informado'}) foi excluído.`, 'Aluno excluído');
      },
      error: (error) => {
        this.modalExcludeAluno.salvando = false;
        this.modalExcludeAluno.erro = mensagemErroApi(error, `Não foi possível excluir o aluno ${event.nome}`);
        this.cdr.detectChanges();
      }
    });
  }

  onLazyLoad(event: any): void {
    const rows = event.rows ?? this.pageSize;
    const first = event.first ?? 0;
    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;

    this.first = first;
    this.pageSize = rows;
    this.alunoService.definirPagina(
      Math.floor(first / rows),
      rows,
      sortField,
      event.sortOrder === -1 ? 'DESC' : event.sortOrder === 1 ? 'ASC' : undefined
    );
  }

emitAlunoAtt(aluno: any){
    this.modalEdit.salvando = true;
    this.modalEdit.erro = '';
    this.alunoService.updateAluno(aluno.id,aluno).subscribe({
      next: () => {
        this.modalEdit.salvando = false;
        this.modalEdit.closeAfterSave();
        this.getAllAlunos();
        this.mostrarToast('success', `Os dados de ${aluno.nome} (RM ${aluno.rm}) foram atualizados.`, 'Aluno atualizado');
      },
      error: error => {
        this.modalEdit.salvando = false;
        this.modalEdit.erro = mensagemErroApi(error, `Não foi possível atualizar ${aluno.nome}`);
        this.cdr.detectChanges();
      }
    });
  }
  insertAluno(aluno: any){
    this.modalInsertAluno.salvando = true;
    this.modalInsertAluno.erro = '';
    this.alunoService.createAluno(aluno).subscribe({
      next: () => {
        this.modalInsertAluno.salvando = false;
        this.modalInsertAluno.closeAfterSave();
        this.getAllAlunos();
        this.mostrarToast('success', `O cadastro de ${aluno.nome} (RM ${aluno.rm}) foi concluído.`, 'Aluno cadastrado');
      },
      error: error => {
        this.modalInsertAluno.salvando = false;
        this.modalInsertAluno.erro = mensagemErroApi(error, `Não foi possível cadastrar ${aluno.nome}`);
        this.cdr.detectChanges();
      }
    });
  }

  getAllAlunos(){
     this.alunoService.recarregarLista();
  }

  ngOnInit(): void {
   this.authSub = this.authService.authState$.subscribe(() => {
      this.hasAutority = this.authService.temAuthority('USER');
      if (this.authService.isLoggedIn() && this.hasAutority) {
        this.alunoService.recarregarLista();
      }
      this.cdr.detectChanges();
    });
    this.alunosSub = this.alunoService.paginaAlunos$.subscribe(pagina => {
      this.alunos = pagina.content;
      this.totalRecords = pagina.totalElements;
      this.pageSize = pagina.size;
      this.first = pagina.page * pagina.size;
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
