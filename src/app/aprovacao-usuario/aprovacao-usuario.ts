import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { UsuarioAdmin } from '../service/usuario-service';

@Component({
  selector: 'app-aprovacao-usuario',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './aprovacao-usuario.html',
  styleUrl: './aprovacao-usuario.css'
})
export class AprovacaoUsuario {
  @Output() aceitar = new EventEmitter<UsuarioAdmin>();

  usuario: UsuarioAdmin | null = null;
  displayModal = false;
  salvando = false;
  erro = '';

  constructor(private cdr: ChangeDetectorRef) {}

  showDialog(usuario: UsuarioAdmin): void {
    this.usuario = usuario;
    this.erro = '';
    this.salvando = false;
    this.displayModal = true;
    this.cdr.detectChanges();
  }

  confirmarAprovacao(): void {
    if (!this.usuario || this.salvando) return;
    this.aceitar.emit(this.usuario);
  }

  closeDialog(): void {
    this.displayModal = false;
    this.cdr.detectChanges();
  }
}
