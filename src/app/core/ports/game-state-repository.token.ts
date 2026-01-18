import { InjectionToken } from '@angular/core';
import { GameStateRepository } from './game-state-repository.port';

export const GAME_STATE_REPOSITORY = new InjectionToken<GameStateRepository>(
  'GameStateRepository'
);
