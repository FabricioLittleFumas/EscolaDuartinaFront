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
import { Route, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario-service';
import { Usuario } from '../model/usuario';


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

   
    value: any;
    items: MenuItem[] | undefined;

    constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef, private router: Router) {}

    ngAfterViewInit() {
        console.log('=== MODAL DISPONÍVEL ===');
        console.log('ModalEntrar:', this.modalEntrar);
        console.log('displayModal inicial:', this.modalEntrar.displayModal);
        this.cdr.detectChanges();
    }

    onLoginConfirm(loginData: {email: string, password: string}) {
        console.log('Login confirmado:', loginData);
        // Aqui você pode processar o login
        // Exemplo: chamar um serviço de autenticação
    }
    onLoginConfirmCadastro(loginData: {name: string, email: string, password: string}) {
        console.log('Cadastro confirmado:', loginData);
        console.log('Cheguei aqio:', loginData);
        // Aqui você pode processar o login
        // Exemplo: chamar um serviço de autenticação

        //vericar o email antes de persistir
        this.usuarioService.createAluno(new Usuario(loginData.name, loginData.email,loginData.password, ['USER'])).subscribe(
            (next) => {
                console.log('dentro do next');
                console.log(next);
            }
        );
    }
    
    onLoginCancel() {
        console.log('Login cancelado');
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Sabbag',
                routerLink: ['home'],
                icon: 'pi pi-home'
            },
            {
                label: 'Alunos',
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S'
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U'
                    }
                ]
            },
            {
                label: 'Entrar',
                command: () => {
                    console.log("=== CLICOU EM ENTRAR ===");
                    if (this.modalEntrar) {
                        console.log("Modal encontrado, chamando showDialog()");
                        this.modalEntrar.showDialog();
                        console.log("displayModal após showDialog:", this.modalEntrar.displayModal);
                        this.cdr.detectChanges(); // Forçar atualização
                    } else {
                        console.error("ERRO: Modal não encontrado!");
                    }
                }
            },
            {
                label: 'Cadastrar',
                command: () => {
                    console.log("=== CLICOU EM CADASTRAR ===");
                    if (this.modalCadastro) {
                        console.log("Modal encontrado, chamando showDialog()");
                        this.modalCadastro.showDialogCadastro();
                        console.log("displayModal após showDialog:", this.modalCadastro.displayModal);
                        this.cdr.detectChanges(); // Forçar atualização
                    } else {
                        console.error("ERRO: Modal não encontrado!");
                    }
                }
            }
        ];
    }
}