import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-modal-cadastro',
  imports: [CommonModule,ReactiveFormsModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modal-cadastro.html',
  styleUrl: './modal-cadastro.css',
})
export class ModalCadastro implements OnInit{
  @Output('insertUsuario') emitUsuario = new EventEmitter<Usuario>();
  @Output() confirm = new EventEmitter<{name: string, email: string, password: string}>();
  @Output() cancel = new EventEmitter<void>();

  usuarioForm!: FormGroup;
  displayModal: boolean = false;
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}

  showDialogCadastro() {
    console.log("=== INICIANDO SHOW DIALOG ===");
    this.displayModal = true;
    this.email = '';
    this.password = '';
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
    if (this.email && this.password) {
      console.log("Confirmando login:", { email: this.email, password: this.password });
      this.confirm.emit({name: this.name, email: this.email, password: this.password });
      this.displayModal = false;
      this.cdr.detectChanges();
    } else {
      alert('Por favor, preencha todos os campos');
    }
  }
   onSubmit(){
   const usuario: Usuario = this.usuarioForm.value;
        console.log("insert usuario modal");
        console.log(usuario);
        this.emitUsuario.emit(usuario);
    }
      ngOnInit(): void {
    this.inicializarFormulario();
  }
    inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
}

