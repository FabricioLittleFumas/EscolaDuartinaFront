import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ButtonModule, DialogModule,FormsModule],
  selector: 'app-modal-view-aluno',
  styleUrl: './modal-view-aluno.css',
  templateUrl: './modal-view-aluno.html',
})
export class ModalViewAluno {
  @Output() confirm = new EventEmitter<{email: string, senha: string}>();
  @Output() cancel = new EventEmitter<void>();

  displayModal: boolean = false;
  email: string = '';
  senha: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

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
