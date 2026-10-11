export class UsuarioToken {
  sub?: string;
  email?: string;
  authorities?: string[];
  permissions?: string[];
  exp?: number;
  [key: string]: any;
}
