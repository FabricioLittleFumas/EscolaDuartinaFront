export class Aluno {
    nome: string;
    unidade: string;
    data_saida: Date;
    id: number;

    constructor(id: number, nome: string, unidade: string, data_saida: Date){
        this.id = id;
        this.nome = nome;
        this.unidade = unidade;
        this.data_saida = data_saida;
    }
}
