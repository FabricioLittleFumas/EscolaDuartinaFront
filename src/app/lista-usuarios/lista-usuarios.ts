import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service';
import { UsuarioAdmin, UsuarioService } from '../service/usuario-service';
import { AprovacaoUsuario } from '../aprovacao-usuario/aprovacao-usuario';
import { mensagemErroApi } from '../utils/http-error-message';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, AprovacaoUsuario],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.css'
})
export class ListaUsuarios implements OnInit, OnDestroy {
  @ViewChild(AprovacaoUsuario) modalAprovacao!: AprovacaoUsuario;
  usuarios: UsuarioAdmin[] = [];
  carregando = false;
  erro = '';
  hasAutority = false;
  usuarioSelecionado: UsuarioAdmin | null = null;
  detalheVisivel = false;
  private authSub?: Subscription;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.authState$.subscribe(() => {
      this.hasAutority = this.authService.isLoggedIn() && this.authService.temAuthority('ADMIN');
      if (this.hasAutority) this.carregarUsuarios();
      else this.usuarios = [];
      this.cdr.detectChanges();
    });
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.erro = '';
    this.usuarioService.listarUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.carregando = false;
        this.usuarios = [];
        this.erro = error.status === 401
          ? 'Sua sessão expirou. Entre novamente para ver os usuários.'
          : error.status === 403
            ? 'Acesso restrito ao administrador.'
            : 'Não foi possível carregar os usuários. Verifique a conexão com o servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  verDetalhes(usuario: UsuarioAdmin): void {
    this.usuarioSelecionado = usuario;
    this.detalheVisivel = true;
  }

  alternarAprovacao(usuario: UsuarioAdmin): void {
    this.modalAprovacao.showDialog(usuario);
  }

  aprovarUsuario(usuario: UsuarioAdmin): void {
    this.modalAprovacao.salvando = true;
    this.modalAprovacao.erro = '';
    const aprovado = !usuario.approved;
    this.usuarioService.atualizarAprovacao(usuario.id, aprovado).subscribe({
      next: atualizado => {
        this.usuarios = this.usuarios.map(item => item.id === usuario.id
          ? { ...item, ...atualizado, approved: atualizado?.approved ?? aprovado }
          : item);
        this.modalAprovacao.concluirComSucesso(aprovado
          ? `O acesso de ${usuario.name} foi liberado. A pessoa já pode entrar no sistema.`
          : `O acesso de ${usuario.name} foi revogado. A pessoa precisará de nova liberação para entrar.`);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.modalAprovacao.salvando = false;
        this.modalAprovacao.erro = mensagemErroApi(error, `Não foi possível alterar o acesso de ${usuario.name}`);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}
