import { HttpErrorResponse } from '@angular/common/http';

export function mensagemErroApi(error: HttpErrorResponse, contexto: string): string {
  const resposta = error.error;
  const mensagemServidor = typeof resposta?.message === 'string' ? resposta.message.trim() : '';
  const detalhesValidacao = resposta?.erroValidacao && typeof resposta.erroValidacao === 'object'
    ? Object.values(resposta.erroValidacao as Record<string, unknown>)
        .filter((valor): valor is string => typeof valor === 'string' && !!valor.trim())
    : [];

  if (detalhesValidacao.length) return `${contexto}: ${detalhesValidacao.join('; ')}`;
  if (mensagemServidor) return `${contexto}: ${mensagemServidor}`;
  if (error.status === 0) return `${contexto}: não foi possível conectar ao servidor. Verifique a conexão e tente novamente.`;
  if (error.status === 400) return `${contexto}: os dados enviados são inválidos. Revise os campos e tente novamente.`;
  if (error.status === 401) return `${contexto}: sua sessão expirou. Entre novamente e repita a ação.`;
  if (error.status === 403) return `${contexto}: sua conta não tem autorização para realizar esta ação.`;
  if (error.status === 404) return `${contexto}: o registro não foi encontrado. Atualize a lista e tente novamente.`;
  if (error.status === 409) return `${contexto}: já existe um registro com esses dados.`;
  if (error.status >= 500) return `${contexto}: o servidor encontrou um problema. Tente novamente mais tarde.`;
  return `${contexto}: ocorreu um erro inesperado (HTTP ${error.status}). Tente novamente.`;
}
