import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { DatePipe } from '@angular/common';
import { Search, User, Check } from '@primeicons/angular';
@Component({
  standalone:true,
  imports: [ButtonModule,DialogModule,FormsModule,DatePipe,User],
  selector: 'app-modal-exclude-aluno',
  styleUrl: './modal-exclude-aluno.css',
  templateUrl: './modal-exclude-aluno.html',
})
export class ModalExcludeAluno {
  @Output() confirm = new EventEmitter<Aluno>();
  @Output() cancel = new EventEmitter<void>();
  @Input('alunoExclude') aluno: Aluno;

  displayModals: boolean = false;
  email: string = '';
  senha: string = '';

  constructor(private cdr: ChangeDetectorRef) {
     this.aluno = new Aluno(1,'','', new Date());
  }
  confirmExclude(){
    this.confirm.emit(this.aluno);
  }

  showDialog(alunos: any) {
    console.log("=== INICIANDO SHOW DIALOG === view aALUNO");
    console.log(alunos);
    this.displayModals = true;
    this.email = '';
    this.senha = '';
    console.log("displayModals definido como:", this.displayModals);
    
    // FORÇAR DETECÇÃO DE MUDANÇAS
    this.cdr.detectChanges();
    
    // Verificar se o dialog está realmente aberto
    setTimeout(() => {
      console.log("displayModals após setTimeout:", this.displayModals);
    }, 100);
  }

  closeDialog() {
    console.log("=== FECHANDO DIALOG ===");
    this.displayModals = false;
    console.log("displayModals definido como:", this.displayModals);
    this.cdr.detectChanges();
    this.cancel.emit();
  }
}
