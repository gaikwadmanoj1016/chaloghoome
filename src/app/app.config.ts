import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../../environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideAnimations(),
    provideHttpClient(),
    provideAnimations(),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      // registrationStrategy: 'registerWhenStable:30000'
    })
  ],
};
