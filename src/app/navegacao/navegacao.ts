import { Component, OnInit } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navegacao',
  imports: [MenubarModule,RippleModule,BadgeModule,AvatarModule,DialogModule,ButtonModule,InputTextModule,FormsModule],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.css',
})
export class Navegacao implements OnInit{
    displayModal: boolean = false;
    value: any;

  showDialog() {
    this.displayModal = true;
  }

  closeDialog() {
    this.displayModal = false;
  }

  confirmDialog() {
    // Lógica de confirmação
    console.log('Confirmado!');
    this.displayModal = false;
  }
  items: MenuItem[] | undefined;
    ngOnInit() {
        
        this.items = [
            {
                label: 'Sabbag',
                icon: 'pi pi-home'
            },
            {
                label: 'Alunos',
                icon: 'pi pi-search',
                // badge: '3',
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
                    this.showDialog();
                }
            },
             {
                label: 'Cadastrar',
                 command: () => {
                    this.showDialog();
                }
              
            }
        ];
    }

}
