import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modal-cadastro',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modal-cadastro.html',
  styleUrl: './modal-cadastro.css',
})
export class ModalCadastro {
  @Output() confirm = new EventEmitter<{email: string, senha: string}>();
  @Output() cancel = new EventEmitter<void>();

  displayModal: boolean = false;
  email: string = '';
  senha: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  showDialogCadastro() {
    console.log("=== INICIANDO SHOW DIALOG ===");
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

  confirmDialog() {
    if (this.email && this.senha) {
      console.log("Confirmando login:", { email: this.email, senha: this.senha });
      this.confirm.emit({ email: this.email, senha: this.senha });
      this.displayModal = false;
      this.cdr.detectChanges();
    } else {
      alert('Por favor, preencha todos os campos');
    }
  }
}

