import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modal-cadastro',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modal-cadastro.html',
  styleUrl: './modal-cadastro.css',
})
export class ModalCadastro implements OnInit{
  @Output() confirm = new EventEmitter<{name: string, email: string, password: string}>();
  @Output() cancel = new EventEmitter<void>();

  usuarioForm!: FormGroup;
  displayModal: boolean = false;
  email: string = '';
  password: string = '';
  name: string = '';
  erro = '';
  salvando = false;

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}

  showDialogCadastro(): void {
    this.displayModal = true;
    this.erro = '';
    this.salvando = false;
    this.usuarioForm.reset({ name: '', email: '', password: '' });
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    if (this.salvando) return;
    this.displayModal = false;
    this.erro = '';
    this.cancel.emit();
  }

  confirmDialog(): void {
    if (this.usuarioForm.invalid || this.salvando) {
      this.usuarioForm.markAllAsTouched();
      this.erro = 'Confira o nome, o e-mail e a senha antes de continuar.';
      return;
    }
    this.erro = '';
    this.confirm.emit(this.usuarioForm.getRawValue());
  }

  closeAfterSubmit(): void { this.displayModal = false; this.salvando = false; this.erro = ''; }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}

