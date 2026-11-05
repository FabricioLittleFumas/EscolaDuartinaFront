import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ModalInsertAluno } from '../modal-insert-aluno/modal-insert-aluno';
import { AlunoService } from '../service/aluno-service';
import { Aluno } from '../model/aluno';


@Component({
  selector: 'app-navegacao',
  imports: [ModalInsertAluno, ToastModule,MenubarModule, RippleModule, BadgeModule,
    AvatarModule, DialogModule, ButtonModule, InputTextModule, FormsModule, ModalEntrar, ModalCadastro],
  templateUrl: './navegacao.html',
  providers: [MessageService],
  styleUrl: './navegacao.css',
})
export class Navegacao implements OnInit, AfterViewInit {

  @ViewChild('modalEntrar') modalEntrar!: ModalEntrar;
  @ViewChild('modalCadastro') modalCadastro!: ModalCadastro;
  @ViewChild('modalInsertAluno') modalInsertAluno!: ModalInsertAluno;

  termoBusca: string = '';
  private buscaSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
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
    .loginUsuario(new LoginUsuario(loginData.email, loginData.password))
    .subscribe((response: any) => {
      this.mostrarToast("success","Sucesso ao efetuar login.", "Sucesso");
      this.tokenService.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        
      });

      this.authService.notificarLogin();  // ✅ avisa todos os inscritos
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

    this.buscaSubject.pipe(
      debounceTime(300),          // espera 300ms sem digitar
      distinctUntilChanged(),     // ignora se o valor não mudou
      takeUntil(this.destroy$)
    ).subscribe(valor => {
      this.executarBusca(valor);
    });
  }
   onBuscar(valor: string) {
    this.buscaSubject.next(valor);
  }

  executarBusca(valor: string) {
    console.log('Busca real com:', valor);
    // exemplo: navegar pra rota de busca
    // this.router.navigate(['/home'], { queryParams: { q: valor } });
    
    // ou chamar service:
    // this.alunoService.buscarPorNome(valor).subscribe(...)
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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