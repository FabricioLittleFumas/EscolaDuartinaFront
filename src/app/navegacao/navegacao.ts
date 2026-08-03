import { Component, OnInit } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-navegacao',
  imports: [MenubarModule,InputTextModule,RippleModule,BadgeModule,AvatarModule],
  templateUrl: './navegacao.html',
  styleUrl: './navegacao.css',
})
export class Navegacao implements OnInit{
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
                badge: '3',
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
            
            },
             {
                label: 'Cadastrar',
              
            }
        ];
    }

}
