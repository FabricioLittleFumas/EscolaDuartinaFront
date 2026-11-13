import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { HttpErrorResponse } from '@angular/common/http';
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
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../service/usuario-service';
import { Usuario } from '../model/usuario';
import { LoginUsuario } from '../model/login-usuario';
import { AuthService } from '../auth-service';
import { TokenService } from '../service/token-service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalInsertAluno } from '../modal-insert-aluno/modal-insert-aluno';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';
import { Subject, Subscription, TimeoutError, debounceTime, distinctUntilChanged, interval, takeUntil, timeout } from 'rxjs';
import { mensagemErroApi } from '../utils/http-error-message';


@Component({
  selector: 'app-navegacao',
  imports: [ModalInsertAluno, ToastModule,MenubarModule, RippleModule, BadgeModule,
    AvatarModule, DialogModule, ButtonModule, InputTextModule, FormsModule, RouterLink, ModalEntrar, ModalCadastro],
  templateUrl: './navegacao.html',
  providers: [MessageService],
  styleUrl: './navegacao.css',
})
export class Navegacao implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modalEntrar') modalEntrar!: ModalEntrar;
  @ViewChild('modalCadastro') modalCadastro!: ModalCadastro;
  @ViewChild('modalInsertAluno') modalInsertAluno!: ModalInsertAluno;

  termoBusca: string = '';
  private buscaSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private authSubscription?: Subscription;
  private quantidadePendentesSubscription?: Subscription;
  quantidadePendentes = 0;
  roleUSER: boolean | undefined;
  value: any;
  items: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
    private alunoService: AlunoService
  ) {}


  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

 onLoginConfirm(loginData: { email: string, password: string }) {
  this.modalEntrar.salvando = true;
  this.modalEntrar.erro = '';
  this.usuarioService
    .loginPeloModal(new LoginUsuario(loginData.email, loginData.password))
    .pipe(timeout({ first: 15_000 }))
    .subscribe((response: any) => {
      if (!response?.accessToken || !response?.refreshToken) {
        this.modalEntrar.salvando = false;
        this.modalEntrar.erro = 'O servidor não concluiu o login porque não retornou os dados de acesso. Tente novamente.';
        this.cdr.detectChanges();
        return;
      }
      this.modalEntrar.closeAfterSubmit();
      this.tokenService.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        
      });

      this.authService.notificarLogin();  // ✅ avisa todos os inscritos
      if (this.authService.temAuthority('ADMIN')) {
        this.usuarioService.atualizarQuantidadePendentes(true);
      }
      this.carregaMenu();
      this.cdr.detectChanges();
      this.mostrarToast('success', `Acesso liberado para ${loginData.email}.`, 'Login realizado');
    }
  , (error: unknown) =>{
     this.modalEntrar.salvando = false;
     const mensagem = error instanceof TimeoutError
       ? 'O servidor não respondeu em 15 segundos. Verifique sua conexão e tente entrar novamente.'
       : error instanceof HttpErrorResponse && error.status === 403
         ? error.error?.message ?? 'Seu cadastro ainda aguarda a aprovação de um administrador.'
         : error instanceof HttpErrorResponse && error.status === 401
           ? 'E-mail ou senha incorretos. Confira os dados e tente novamente.'
           : error instanceof HttpErrorResponse
             ? mensagemErroApi(error, 'Não foi possível entrar')
             : 'Ocorreu um erro inesperado durante a validação. Tente novamente.';
     this.modalEntrar.erro = mensagem;
     this.cdr.detectChanges();
  });
}

  onLoginConfirmCadastro(loginData: { name: string, email: string, password: string }) {
    this.modalCadastro.salvando = true;
    this.modalCadastro.erro = '';
    this.usuarioService
      .createUsuario(new Usuario(loginData.name, loginData.email, loginData.password, ['USER']))
      .subscribe((next) => {
        this.modalCadastro.closeAfterSubmit();
        if (this.authService.temAuthority('ADMIN')) {
          this.usuarioService.atualizarQuantidadePendentes();
        }
        this.mostrarToast('success', `Cadastro de ${loginData.name} recebido. O acesso será liberado após aprovação do administrador.`, 'Cadastro enviado');
      },
    error =>{
       this.modalCadastro.salvando = false;
       this.modalCadastro.erro = mensagemErroApi(error, `Não foi possível cadastrar ${loginData.email}`);
       this.cdr.detectChanges();
    });
  }

  onLoginCancel() {
    console.log('Login cancelado');
  }

  carregaMenu() {
    const isUser = this.authService.temAuthority('USER');
    const isAdmin = this.authService.temAuthority('ADMIN');
    const isAuthenticated = this.authService.isLoggedIn();
    this.items = [
      { label: 'Ouvir PDF', icon: 'pi pi-headphones', routerLink: ['/leitura-pdf'], visible: this.authService.isLoggedIn() },
      {
        label: 'Início',
        routerLink: ['/home'],
        icon: 'pi pi-home',
      },
      {
        label: 'Nossa escola',
        icon: 'pi pi-heart',
        routerLink: ['/home'],
        fragment: 'historia-escola',
      },
      {
        label: 'Alunos',
        visible: isAuthenticated,
        icon: 'pi pi-users',
        items: [
          { label: 'Cadastrar aluno',
            command: () => {
          if (this.modalInsertAluno) this.modalInsertAluno.showDialog(new Aluno(1,'','',new Date()))}
          ,
             visible: isUser, icon: 'pi pi-user-plus' },
          { label: 'Consultar alunos', routerLink: ['/home'], fragment: 'lista-alunos', visible: isAuthenticated, icon: 'pi pi-search' },
        ]
      },
      {
        label: 'Entrar',
        visible: !isAuthenticated,
        command: () => {
          if (this.modalEntrar) this.modalEntrar.showDialog();
        }
      },
      {
        label: 'Cadastrar',
        visible: !isAuthenticated,
        command: () => {
          if (this.modalCadastro) this.modalCadastro.showDialogCadastro();
        }
      },
      {
        label: 'Autorização',
        icon: 'pi pi-user-edit',
        routerLink: ['/autorizacao-usuario'],
        visible: isAdmin,
        badge: isAdmin && this.quantidadePendentes > 0 ? String(this.quantidadePendentes) : undefined,
        badgeStyleClass: 'badge-autorizacao'
      },
      {
        label: 'Usuários',
        icon: 'pi pi-users',
        routerLink: ['/usuarios'],
        visible: isAdmin
      },
      {
        label: 'Logs do sistema',
        icon: 'pi pi-history',
        routerLink: ['/log-system'],
        visible: isAdmin
      },
      {
        label: 'Sair',
  visible: isAuthenticated,
  command: () => {
    this.tokenService.clearTokens();
    this.authService.notificarLogout();  // ✅ avisa todos os inscritos
    this.carregaMenu();
    this.cdr.detectChanges();
    this.router.navigateByUrl("/");
        }
      }
    ];
  }

  ngOnInit() {
    this.carregaMenu();
    this.quantidadePendentesSubscription = this.usuarioService.quantidadePendentes$.subscribe(quantidade => {
      this.quantidadePendentes = quantidade;
      if (this.authService.temAuthority('ADMIN')) this.carregaMenu();
      this.cdr.detectChanges();
    });
    this.authSubscription = this.authService.authState$.subscribe(() => {
      this.carregaMenu();
      if (!this.authService.temAuthority('ADMIN')) {
        this.usuarioService.definirQuantidadePendentes(0);
      }
    });
    if (this.authService.temAuthority('ADMIN')) {
      this.usuarioService.atualizarQuantidadePendentes();
    }
    interval(3000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.authService.temAuthority('ADMIN')) {
        this.usuarioService.atualizarQuantidadePendentes();
      }
    });
    this.buscaSubject.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(termo => {
      this.alunoService.definirTermoBusca(termo);
      if (termo.trim() && this.router.url.split(/[?#]/)[0] !== '/home') {
        this.router.navigate(['/home'], { fragment: 'lista-alunos' });
      }
    });
  }

  onBuscar(valor: string) {
    this.buscaSubject.next(valor);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.authSubscription?.unsubscribe();
    this.quantidadePendentesSubscription?.unsubscribe();
  }

  mostrarToast(severidade: string, detalhe: string, sumario: string ){
  this.messageService.add({ 
      severity: severidade, 
      summary: sumario, 
      detail: detalhe,
      sticky: false
    });
  }

  insertAluno(aluno: any){
    this.modalInsertAluno.salvando = true;
    this.modalInsertAluno.erro = '';
    this.alunoService.createAluno(aluno).subscribe((next) =>{
      this.modalInsertAluno.salvando = false;
      this.modalInsertAluno.closeAfterSave();
      this.mostrarToast('success', `O cadastro de ${aluno.nome} (RM ${aluno.rm}) foi concluído.`, 'Aluno cadastrado');
    },
    (error) => {
      this.modalInsertAluno.salvando = false;
      this.modalInsertAluno.erro = mensagemErroApi(error, `Não foi possível cadastrar ${aluno.nome}`);
      this.cdr.detectChanges();
    }
  )
  }
}
