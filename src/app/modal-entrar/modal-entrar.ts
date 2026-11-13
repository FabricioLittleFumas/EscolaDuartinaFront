import { Component, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



@Component({
  selector: 'app-modal-entrar',
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './modal-entrar.html',
  styleUrl: './modal-entrar.css',
})
export class ModalEntrar implements OnInit{
  @Output() confirm = new EventEmitter<{email: string, password: string}>();
  @Output() cancel = new EventEmitter<void>();

  loginForm!: FormGroup;
  displayModal: boolean = false;
  email: string = '';
  password: string = '';
  erro = '';
  salvando = false;

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  showDialog(): void {
    this.displayModal = true;
    this.erro = '';
    this.salvando = false;
    this.loginForm.reset({ email: '', password: '' });
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    if (this.salvando) return;
    this.displayModal = false;
    this.erro = '';
    this.cancel.emit();
  }

  confirmDialog(): void {
    if (this.loginForm.invalid || this.salvando) {
      this.loginForm.markAllAsTouched();
      this.erro = 'Informe seu e-mail e sua senha para entrar.';
      return;
    }
    this.erro = '';
    this.confirm.emit(this.loginForm.getRawValue());
  }

  closeAfterSubmit(): void { this.displayModal = false; this.salvando = false; this.erro = ''; }

   inicializarFormulario(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}
