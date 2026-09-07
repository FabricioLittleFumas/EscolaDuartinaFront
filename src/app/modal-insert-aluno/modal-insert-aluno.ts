import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aluno } from '../model/aluno';
@Component({
  standalone: true,
  imports: [ButtonModule,DialogModule,FormsModule, ReactiveFormsModule],
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
  data_saida: string = '';
  unidade: string = '';

  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

    inicializarFormulario(): void {
    this.alunoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      data_saida: ['data_saida', Validators.required],
      unidade: ['', Validators.required]
    });
  }

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
  onSubmit(){
 const aluno: Aluno = this.alunoForm.value;
      console.log("insert aluno modal");
      console.log(aluno);
      this.emitAluno.emit(aluno);
  }
}
