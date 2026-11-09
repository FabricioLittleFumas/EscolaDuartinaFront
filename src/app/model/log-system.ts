export interface LogSystem {
  id: number;
  acao: string;
  usuarioId: number;
  nomeUsuario: string;
  dataHora: string;
}

export interface PaginaLogSystem {
  content: LogSystem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
