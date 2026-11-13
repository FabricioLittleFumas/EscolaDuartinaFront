import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Aluno } from '../model/aluno';
import { User } from '@primeicons/angular';
@Component({
  standalone:true,
  imports: [CommonModule, ButtonModule, DialogModule, User],
  selector: 'app-modal-exclude-aluno',
  styleUrl: './modal-exclude-aluno.css',
  templateUrl: './modal-exclude-aluno.html',
})
export class ModalExcludeAluno {
  @Output() confirm = new EventEmitter<Aluno>();
  @Output() cancel = new EventEmitter<void>();
  @Input('alunoExclude') aluno: Aluno;

  displayModals: boolean = false;
  erro = '';
  salvando = false;

  constructor(private cdr: ChangeDetectorRef) {
     this.aluno = new Aluno(1,'','', new Date());
  }
  confirmExclude(): void {
    if (this.salvando) return;
    this.erro = '';
    this.confirm.emit(this.aluno);
  }

  showDialog(aluno: Aluno): void {
    this.aluno = aluno;
    this.erro = '';
    this.salvando = false;
    this.displayModals = true;
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    if (this.salvando) return;
    this.displayModals = false;
    this.erro = '';
    this.cancel.emit();
  }

  closeAfterDelete(): void {
    this.displayModals = false;
    this.erro = '';
    this.salvando = false;
    this.cdr.detectChanges();
  }
}
