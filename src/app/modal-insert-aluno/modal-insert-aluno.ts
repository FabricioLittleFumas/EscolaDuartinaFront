import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

import { Calendar } from '@primeicons/angular';
@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, ReactiveFormsModule, DatePickerModule],
  selector: 'app-modal-insert-aluno',
  styleUrl: './modal-insert-aluno.css',
  templateUrl: './modal-insert-aluno.html',
})
export class ModalInsertAluno implements OnInit{
  @Output('insertAluno') emitAluno = new EventEmitter<Aluno>();
  @Output() cancel = new EventEmitter<void>();
  alunoForm!: FormGroup;
  displayModal: boolean = false;
  nome: string = '';
  data_nascimento: Date | undefined;
  date: Date | undefined;
  unidade: string = '';
  erro = '';
  salvando = false;

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

    inicializarFormulario(): void {
    this.alunoForm = this.fb.group({
      rm: [null, [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: [null],
      unidade: ['', Validators.required]
    });
  }

  showDialog(_aluno?: Aluno): void {
    this.alunoForm.reset({ rm: null, nome: '', dates: null, data_nascimento: null, unidade: '' });
    this.erro = '';
    this.salvando = false;
    this.displayModal = true;
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    if (this.salvando) return;
    this.displayModal = false;
    this.erro = '';
    this.cancel.emit();
  }

  closeAfterSave(): void {
    this.displayModal = false;
    this.alunoForm.reset({ rm: null, nome: '', dates: null, data_nascimento: null, unidade: '' });
    this.erro = '';
    this.salvando = false;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.alunoForm.invalid || this.salvando) {
      this.alunoForm.markAllAsTouched();
      this.erro = 'Confira o RM, o nome e a unidade. A data de nascimento pode ficar em branco.';
      return;
    }
    this.erro = '';
    this.emitAluno.emit(this.alunoForm.getRawValue() as Aluno);
  }
}
