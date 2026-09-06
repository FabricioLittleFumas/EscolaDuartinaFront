export class Aluno {
    nome: string;
    unidade: string;
    dataSaida: string;
    id: number;

    constructor(id: number, nome: string, unidade: string, dataSaida: string){
        this.id = id;
        this.nome = nome;
        this.unidade = unidade;
        this.dataSaida =dataSaida;
    }
}
