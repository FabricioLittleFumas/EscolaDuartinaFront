import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { PrimeNG } from 'primeng/config';
import { CalendarModule } from 'primeng/calendar';


import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Interceptador } from './interceptador';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('auth_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:4200'],          // Domínios que receberão o token automaticamente
          disallowedRoutes: ['localhost:4200/auth/login'] // Rotas que não devem enviar o token
        }
      })
    ),
    provideRouter(routes),
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({ 
      theme: { preset: Aura } ,
      license: 'eyJpZCI6ImZlMmE0MjJlLWM4YTItNGJjZC04YWYwLTAxZmE3NDNlZTJkYyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODU3MzQ1MTAsImV4cCI6MTgxNzI3MDUxMH0.j09smPvHnAgbiBLjaZ-iYnJBXekOFy-INedBT6W9Kw77mpEVEd7o6RLhjrTvqY7rcQATVoQIWZ2SwAONPU3FBQ' 
    }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptador,
      multi: true
    }
  ],
  
};
