import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, DatePickerModule, ReactiveFormsModule],
  selector: 'app-modal-edit-aluno',
  styleUrl: './modal-edit-aluno.css',
  templateUrl: './modal-edit-aluno.html',
})
export class ModalEditAluno implements OnInit{
   @Output('emitAlunoAtt') emitAlunoAtt = new EventEmitter<Aluno>();
   @Output() cancel = new EventEmitter<void>();
   @Input() aluno: Aluno;
  alunoForms!: FormGroup;
  displayModal: boolean = false;
  erro = '';
  salvando = false;
    nome: string = '';

  dtNascimento: string = '';
  unidade: string = '';

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.aluno = new Aluno(1,'','',new Date());

  }
  ngOnInit(): void {
   this.inicializarFormulario();
  }

  showDialog(alunos: any) {
    this.aluno = alunos;
    this.erro = '';
    this.salvando = false;
    this.displayModal = true;
    this.alunoForms.patchValue({
      id: alunos.id,
      rm: alunos.rm ?? null,
      nome: alunos.nome,
      data_nascimento: alunos.data_nascimento ? new Date(alunos.data_nascimento) : null,
      unidade: alunos.unidade
    });
    this.cdr.detectChanges();
  }

  closeDialog() {
    if (this.salvando) return;
    this.displayModal = false;
    this.erro = '';
    this.alunoForms.reset();
    this.cancel.emit();
  }

  closeAfterSave(): void {
    this.displayModal = false;
    this.erro = '';
    this.salvando = false;
    this.alunoForms.reset();
    this.cdr.detectChanges();
  }

   inicializarFormulario(): void {
    this.alunoForms = this.fb.group({
      id: ['', Validators.required],
      rm: [null, [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: [null],
      unidade: ['', Validators.required],
    });
   
  }
   onSubmit(){
    if (this.alunoForms.invalid || this.salvando) {
      this.alunoForms.markAllAsTouched();
      this.erro = 'Confira o RM, o nome e a unidade antes de salvar. A data de nascimento pode ficar em branco.';
      return;
    }
    this.erro = '';
    const aluno: Aluno = this.alunoForms.value;
      aluno.id = this.aluno.id;
      this.emitAlunoAtt.emit(aluno);
  }
}
