import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Aluno } from '../model/aluno';
import { DatePipe } from '@angular/common';
import { User } from '@primeicons/angular';

@Component({
  standalone: true,
  imports: [ButtonModule, DialogModule,FormsModule,DatePipe,User],
  selector: 'app-modal-view-aluno',
  styleUrl: './modal-view-aluno.css',
  templateUrl: './modal-view-aluno.html',
})
export class ModalViewAluno {
  @Output() confirm = new EventEmitter<{email: string, senha: string}>();
  @Output() cancel = new EventEmitter<void>();
  @Input() aluno: Aluno;

  displayModal: boolean = false;
  email: string = '';
  senha: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    this.aluno = new Aluno(1,'','',new Date());
  }

  showDialog(aluno: Aluno): void {
    this.aluno = aluno;
    this.displayModal = true;
    this.cdr.detectChanges();
  }

  closeDialog(): void {
    this.displayModal = false;
    this.cancel.emit();
  }
}
