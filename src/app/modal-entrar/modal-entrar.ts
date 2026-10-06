import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../model/usuario';



@Component({
  selector: 'app-modal-entrar',
  imports: [CommonModule,ReactiveFormsModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modal-entrar.html',
  styleUrl: './modal-entrar.css',
})
export class ModalEntrar implements OnInit{
  @Output('loginUsuario') emitUsuario = new EventEmitter<Usuario>();
  @Output() confirm = new EventEmitter<{email: string, password: string}>();
  @Output() cancel = new EventEmitter<void>();

  loginForm!: FormGroup;
  displayModal: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  showDialog() {
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

     onSubmit(){
     const usuario: Usuario = this.loginForm.value;
          console.log("insert usuario modal");
          console.log(usuario);
          this.emitUsuario.emit(usuario);
      }

  confirmDialog() {
    if (this.email && this.password) {
      console.log("Confirmando login:", { email: this.email, password: this.password });
      this.confirm.emit({ email: this.email, password: this.password });
      this.displayModal = false;
      this.cdr.detectChanges();
    } else {
      alert('Por favor, preencha todos os campos');
    }
  }
   inicializarFormulario(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
}