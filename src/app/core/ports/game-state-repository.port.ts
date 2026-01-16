import { GameState } from '../domain/game-state.model';

export interface GameStateRepository {
  load(): GameState | null;
  save(state: GameState): void;
  clear(): void;
}


