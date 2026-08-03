import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-lista-alunos',
  imports: [TableModule],
  templateUrl: './lista-alunos.html',
  styleUrl: './lista-alunos.css',
})
export class ListaAlunos implements OnInit {
  products: any;
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  
}
