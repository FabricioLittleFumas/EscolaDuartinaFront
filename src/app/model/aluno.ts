export class Aluno {
    nome: string;
    unidade: string;
    data: Date;

    constructor(nome: string, unidade: string, data: Date){
        this.nome = nome;
        this.unidade = unidade;
        this.data = new Date('2026-12-31');
    }
}
