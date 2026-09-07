import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ButtonModule,DialogModule,FormsModule],
  selector: 'app-modal-insert-aluno',
  styleUrl: './modal-insert-aluno.css',
  templateUrl: './modal-insert-aluno.html',
})
export class ModalInsertAluno {
  @Output() confirm = new EventEmitter<{email: string, senha: string}>();
  @Output() cancel = new EventEmitter<void>();

  displayModal: boolean = false;
  nome: string = '';
  dtNascimento: string = '';
  unidade: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  showDialog(alunos: any) {
    console.log("=== INICIANDO SHOW DIALOG === view aALUNO");
    console.log(alunos);
    this.displayModal = true;
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
