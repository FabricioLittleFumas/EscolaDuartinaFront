import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ModalEntrar } from '../modal-entrar/modal-entrar';
import { ModalCadastro } from '../modal-cadastro/modal-cadastro';
import { Router } from '@angular/router';
import { UsuarioService } from '../service/usuario-service';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';
import { AuthService } from '../auth-service';
import { TokenService } from '../service/token-service';


@Component({
  selector: 'app-navegacao',
  imports: [MenubarModule, RippleModule, BadgeModule,
    AvatarModule, DialogModule, ButtonModule, InputTextModule, FormsModule, ModalEntrar, ModalCadastro],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.css',
})
export class Navegacao implements OnInit, AfterViewInit {

  @ViewChild('modalEntrar') modalEntrar!: ModalEntrar;
  @ViewChild('modalCadastro') modalCadastro!: ModalCadastro;

  roleUSER: boolean | undefined;
  value: any;
  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onLoginConfirm(loginData: { email: string, password: string }) {
    this.usuarioService
      .loginUsuario(new LoginUsuario(loginData.email, loginData.password))
      .subscribe((response: any) => {
        // Backend agora retorna { accessToken, refreshToken }
        this.tokenService.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        });
        this.cdr.detectChanges();
        this.carregaMenu();
      });
  }

  onLoginConfirmCadastro(loginData: { name: string, email: string, password: string }) {
    this.usuarioService
      .createUsuario(new Usuario(loginData.name, loginData.email, loginData.password, ['USER']))
      .subscribe((next) => {
        console.log('Usuário criado:', next);
      });
  }

  onLoginCancel() {
    console.log('Login cancelado');
  }

  carregaMenu() {
    const isUser = this.authService.temAuthority('USER');
    this.items = [
      {
        label: 'Sabbag',
        routerLink: ['home'],
        icon: 'pi pi-home',
      },
      {
        label: 'Alunos',
        icon: 'pi pi-search',
        items: [
          { label: 'Inserir', icon: 'pi pi-bolt', shortcut: '⌘+S' },
          { label: 'Blocks', icon: 'pi pi-server', shortcut: '⌘+B' },
          { separator: true },
          { label: 'UI Kit', icon: 'pi pi-pencil', shortcut: '⌘+U' }
        ]
      },
      {
        label: 'Entrar',
        command: () => {
          if (this.modalEntrar) this.modalEntrar.showDialog();
        }
      },
      {
        label: 'Cadastrar',
        command: () => {
          if (this.modalCadastro) this.modalCadastro.showDialogCadastro();
        }
      },
      {
        label: 'Sair',
        visible: isUser,
        command: () => {
          this.tokenService.clearTokens();
          this.carregaMenu();
          this.cdr.detectChanges();
          this.router.navigateByUrl("/");
        }
      }
    ];
  }

  ngOnInit() {
    this.carregaMenu();
  }
}