import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { PrimeNG } from 'primeng/config';


import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({ 
      theme: { preset: Aura } ,
      license: 'eyJpZCI6ImZlMmE0MjJlLWM4YTItNGJjZC04YWYwLTAxZmE3NDNlZTJkYyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODU3MzQ1MTAsImV4cCI6MTgxNzI3MDUxMH0.j09smPvHnAgbiBLjaZ-iYnJBXekOFy-INedBT6W9Kw77mpEVEd7o6RLhjrTvqY7rcQATVoQIWZ2SwAONPU3FBQ' 
    })
  ],
  
};
