import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { routesAuth } from './components/auth/app_auth.routes';
import { routesDashboard } from './components/dashboard/app_dashboard.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideRouter(routesAuth),
    provideRouter(routesDashboard),
    provideClientHydration(), provideAnimationsAsync()]
};
