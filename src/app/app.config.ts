import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { PrimeNG } from 'primeng/config';


import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({ 
      theme: { preset: Aura } ,
      license: '' 
    })
  ],
  
};
