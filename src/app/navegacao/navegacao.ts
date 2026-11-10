import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalInsertAluno } from '../modal-insert-aluno/modal-insert-aluno';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';
import { Subject, Subscription, debounceTime, distinctUntilChanged, interval, takeUntil } from 'rxjs';


@Component({
  selector: 'app-navegacao',
  imports: [ModalInsertAluno, ToastModule,MenubarModule, RippleModule, BadgeModule,
    AvatarModule, DialogModule, ButtonModule, InputTextModule, FormsModule, ModalEntrar, ModalCadastro],
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
  this.usuarioService
    .loginPeloModal(new LoginUsuario(loginData.email, loginData.password))
    .subscribe((response: any) => {
      this.mostrarToast("success","Sucesso ao efetuar login.", "Sucesso");
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
    }
  , error =>{
     this.mostrarToast("error","Usuário ou senha inválida", "Erro");
  });
}

  onLoginConfirmCadastro(loginData: { name: string, email: string, password: string }) {
    this.usuarioService
      .createUsuario(new Usuario(loginData.name, loginData.email, loginData.password, ['USER']))
      .subscribe((next) => {
        this.mostrarToast("success","Sucesso ao efetuar cadastro.", "Sucesso");
        if (this.authService.temAuthority('ADMIN')) {
          this.usuarioService.atualizarQuantidadePendentes();
        }
        console.log('Usuário criado:', next);
      },
    error =>{
       this.mostrarToast("error",error.error.message, "Erro");
    });
  }

  onLoginCancel() {
    console.log('Login cancelado');
  }

  carregaMenu() {
    const isUser = this.authService.temAuthority('USER');
    const isAdmin = this.authService.temAuthority('ADMIN');
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
          { label: 'Inserir',
            command: () => {
          if (this.modalInsertAluno) this.modalInsertAluno.showDialog(new Aluno(1,'','',new Date()))}
          ,
             visible: isUser, icon: 'pi pi-bolt', shortcut: '⌘+S' },
          { label: 'Blocks', icon: 'pi pi-server', shortcut: '⌘+B' },
          { separator: true },
          { label: 'UI Kit', icon: 'pi pi-pencil', shortcut: '⌘+U' }
        ]
      },
      {
        label: 'Entrar',
        visible: !isUser,
        command: () => {
          if (this.modalEntrar) this.modalEntrar.showDialog();
        }
      },
      {
        label: 'Cadastrar',
        visible: !isUser,
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
        label: 'Logs do sistema',
        icon: 'pi pi-history',
        routerLink: ['/log-system'],
        visible: true
      },
      {
        label: 'Sair',
  visible: isUser,
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
    ).subscribe(termo => this.alunoService.definirTermoBusca(termo));
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
    console.log("alunoo do inserir aluno");
    console.log(aluno);
    this.alunoService.createAluno(aluno).subscribe((next) =>{
      this.cdr.detectChanges();
      // this.getAllAlunos();
      this.modalInsertAluno.closeDialogs();
      this.mostrarToast("success","Sucesso ao inserir aluno.", "Sucesso");
    },
    (error) => {
      console.log("aconteceu um erro ao inserir aluno");
      console.log(error);
      this.mostrarToast("error",error.error.message, "Erro");
    }
  )
  }
}
