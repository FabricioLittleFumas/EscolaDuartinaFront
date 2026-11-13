import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  standalone: true,
  imports: [ButtonModule, DialogModule, DatePickerModule, FormsModule,ReactiveFormsModule],
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
    console.log("=== INICIANDO SHOW DIALOG === view aALUNO");
    console.log(alunos);
    this.aluno = alunos;
    this.displayModal = true;
    console.log("displayModal definido como:", this.displayModal);
    this.alunoForms.patchValue({
      id: alunos.id,
      rm: alunos.rm ?? null,
      nome: alunos.nome,
      data_nascimento: alunos.data_nascimento ? new Date(alunos.data_nascimento) : null,
      unidade: alunos.unidade
    });
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
    // this.cdr.detectChanges();
    this.cancel.emit();
  }

  closeAfterSave(): void {
    this.displayModal = false;
    this.cdr.detectChanges();
  }

   inicializarFormulario(): void {
    this.alunoForms = this.fb.group({
      id: ['', Validators.required],
      rm: [null, [Validators.required, Validators.min(1)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: [null, Validators.required],
      unidade: ['', Validators.required],
    });
   
  }
   onSubmit(){
    const aluno: Aluno = this.alunoForms.value;
      console.log("insert aluno modal");
      console.log(aluno);
      aluno.id = this.aluno.id;
      this.emitAlunoAtt.emit(aluno);
  }
}
