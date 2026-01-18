import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { GAME_STATE_REPOSITORY } from './core/ports/game-state-repository.token';
import { LocalStorageGameStateAdapter } from './infrastructure/adapters/local-storage-game-state.adapter';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
    {
      provide: GAME_STATE_REPOSITORY,
      useClass: LocalStorageGameStateAdapter,
    },
  ],
};
