export class Aluno {
    rm: number | null;
    nome: string;
    unidade: string;
    data_nascimento: Date | null;
    id: number;

    constructor(id: number, nome: string, unidade: string, data_nascimento: Date | null, rm: number | null = null){
        this.id = id;
        this.rm = rm;
        this.nome = nome;
        this.unidade = unidade;
        this.data_nascimento = data_nascimento;
    }
}
