import { ChangeDetectorRef, Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { DatePipe } from '@angular/common';
import { Search, User, Check } from '@primeicons/angular';

@Component({
  standalone: true,
  imports: [ButtonModule, DialogModule,FormsModule,DatePipe,User],
  selector: 'app-modal-view-aluno',
  styleUrl: './modal-view-aluno.css',
  templateUrl: './modal-view-aluno.html',
})
export class ModalViewAluno {
  @Output() confirm = new EventEmitter<{email: string, senha: string}>();
  @Output() cancel = new EventEmitter<void>();
  @Input() aluno: Aluno;

  displayModal: boolean = false;
  email: string = '';
  senha: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    this.aluno = new Aluno(1,'','','');
  }

  showDialog(alunos: any) {
    console.log("=== INICIANDO SHOW DIALOG === view aALUNO");
    console.log(alunos);
    this.displayModal = true;
    this.email = '';
    this.senha = '';
    console.log("displayModal definido como:", this.displayModal);
    
    // FORÇAR DETECÇÃO DE MUDANÇAS
    this.cdr.detectChanges();
    
    // Verificar se o dialog está realmente aberto
    setTimeout(() => {
      console.log("displayModal após setTimeout:", this.displayModal);
    }, 100);
  }

  closeDialog() {
    console.log("=== FECHANDO DIALOG ===");
    this.displayModal = false;
    console.log("displayModal definido como:", this.displayModal);
    this.cdr.detectChanges();
    this.cancel.emit();
  }
}
