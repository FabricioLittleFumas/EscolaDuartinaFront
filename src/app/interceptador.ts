import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class Interceptador implements HttpInterceptor{

private readonly TOKEN_KEY = 'auth_token';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Verifica se a requisição já tem o header Authorization
    const authHeader = req.headers.get('Authorization');
    let token: string | null = null;
    
    console.log('intercept');
     console.log(authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // 2. Extrai o token (remove "Bearer ")
      token = authHeader.substring(7);

      // 3. Salva no localStorage
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('Token salvo no localStorage:', token);
    } else {
      // 4. Se não veio no header, tenta pegar do localStorage
     console.log('intercept local starage');
     token = localStorage.getItem(this.TOKEN_KEY);
     console.log(token);
    }

    // 5. Se existir token, clona a requisição e adiciona o header
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
        console.log('envio req clonada');
        console.log(clonedReq.headers.get('Authorization'));
        console.log(clonedReq);
      return next.handle(clonedReq);
    }

    // 6. Sem token, segue a requisição normal
    return next.handle(req);
  }
}
