import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Inject, inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Interceptador implements HttpInterceptor{
  private jwtHelper =  inject(JwtHelperService);

private readonly TOKEN_KEY = 'auth_token';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(this.TOKEN_KEY);

    // Se não tem token, segue a requisição normalmente
    if (!token) {
      return next.handle(req);
    }
     // Verifica se o token está expirado
    if (this.jwtHelper.isTokenExpired(token)) {
      // Remove o token expirado do localStorage
      localStorage.removeItem(this.TOKEN_KEY);

      // Opcional: também pode redirecionar para login
      // this.router.navigate(['/login']);

      return next.handle(req);
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Payload do Token:', decodedToken);
      console.log('ID do Usuário:', decodedToken.sub);
      console.log('Roles:', decodedToken.authorities);
    
    // (só adiciona se ainda não existir)
    if (!req.headers.has('Authorization')) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
       return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
    //   // 1. Verifica se a requisição já tem o header Authorization
  //   const authHeader = req.headers.get('Authorization');
  //   let token: string | null = null;
    
  //   console.log('intercept');
  //    console.log(authHeader);
  //   if (authHeader && authHeader.startsWith('Bearer ')) {
  //     // 2. Extrai o token (remove "Bearer ")
  //     token = authHeader.substring(7);

  //     // 3. Salva no localStorage
  //     localStorage.setItem(this.TOKEN_KEY, token);
  //     console.log('Token salvo no localStorage:', token);


  //     // 2. Decodifica o token usando o Helper
  //     // O decodeToken retorna o payload (objeto JavaScript)
  //     if(token){
  //     const decodedToken = this.jwtHelper.decodeToken(token);
  //     const currentMillis: number = Date.now();
  //     console.log(currentMillis);
  //     // if(currentMillis > decodedToken.exp) localStorage.clear();
  //     // 3. Agora você tem acesso aos dados (ex: id do usuário, roles, expiração)
  //     console.log('Payload do Token:', decodedToken);
  //     console.log('ID do Usuário:', decodedToken.sub);
  //     console.log('Roles:', decodedToken.authorities);
  //     }
     
  //   } else {
  //     // 4. Se não veio no header, tenta pegar do localStorage
  //    console.log('intercept local starage');
  //    token = localStorage.getItem(this.TOKEN_KEY);
  //       // 2. Decodifica o token usando o Helper
  //     // O decodeToken retorna o payload (objeto JavaScript)
  //     if(token){
  //     const decodedToken = this.jwtHelper.decodeToken(token);
  //     const currentMillis: number = Date.now();
  //     console.log(currentMillis);
  //     // if(currentMillis > decodedToken.exp) localStorage.clear();
  //     // 3. Agora você tem acesso aos dados (ex: id do usuário, roles, expiração)
  //     console.log('Payload do Token:', decodedToken);
  //     console.log('ID do Usuário:', decodedToken.sub);
  //     console.log('Roles:', decodedToken.authorities);
  //     }
  //    console.log(token);
  //   }

  //   // 5. Se existir token, clona a requisição e adiciona o header
  //   if (token) {
  //     const clonedReq = req.clone({
  //       setHeaders: {
  //         Authorization: `${token}`
  //       }
  //     });
  //       console.log('envio req clonada');
  //       console.log(clonedReq.headers.get('Authorization'));
  //       console.log(clonedReq);
  //     return next.handle(clonedReq);
  //   }

  //   // 6. Sem token, segue a requisição normal
  //   localStorage.clear();
  //   return next.handle(req);
  // }
