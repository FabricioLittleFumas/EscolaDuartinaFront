import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioAdmin, UsuarioService } from '../service/usuario-service';
import { AprovacaoUsuario } from '../aprovacao-usuario/aprovacao-usuario';
import { mensagemErroApi } from '../utils/http-error-message';

@Component({
  selector: 'app-autorizacao-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, AprovacaoUsuario],
  templateUrl: './autorizacao-usuario.html',
  styleUrl: './autorizacao-usuario.css'
})
export class AutorizacaoUsuario implements OnInit {
  @ViewChild(AprovacaoUsuario) modalAprovacao!: AprovacaoUsuario;
  usuarios: UsuarioAdmin[] = [];
  carregando = true;
  erro = '';

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erro = '';
    this.usuarioService.listarUsuariosPendentes().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.carregando = false;
        this.usuarioService.definirQuantidadePendentes(usuarios.length);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.usuarios = [];
        this.carregando = false;
        this.erro = error.status === 401
          ? 'Sua sessão expirou. Entre novamente para ver os usuários.'
          : error.status === 403
            ? 'Acesso restrito ao administrador.'
            : 'Não foi possível carregar os usuários. Verifique a conexão com o servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  solicitarAprovacao(usuario: UsuarioAdmin, evento: Event): void {
    const checkbox = evento.target as HTMLInputElement;
    const solicitouAceite = checkbox.checked;
    checkbox.checked = false;
    if (solicitouAceite) this.modalAprovacao.showDialog(usuario);
  }

  aprovarUsuario(usuario: UsuarioAdmin): void {
    this.modalAprovacao.salvando = true;
    this.modalAprovacao.erro = '';
    this.usuarioService.atualizarAprovacao(usuario.id, true).subscribe({
      next: () => {
        this.modalAprovacao.concluirComSucesso(`O acesso de ${usuario.name} foi liberado. A pessoa já pode entrar no sistema.`);
        // Reconsulta a API para exibir somente os cadastros ainda pendentes.
        // A aprovação não altera a sessão do administrador nem navega para outra rota.
        this.carregarUsuarios();
      },
      error: error => {
        this.modalAprovacao.salvando = false;
        this.modalAprovacao.erro = mensagemErroApi(error, `Não foi possível liberar o acesso de ${usuario.name}`);
        this.cdr.detectChanges();
      }
    });
  }
}
