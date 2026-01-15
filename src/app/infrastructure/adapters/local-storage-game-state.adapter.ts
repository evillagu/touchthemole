import { GameStateRepository } from '../../core/ports/game-state-repository.port';
import { GameState } from '../../core/domain/game-state.model';

export class LocalStorageGameStateAdapter implements GameStateRepository {
  private readonly storageKey = 'touch-the-mole:game-state';

  load(): GameState | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as GameState;
      if (!parsed?.playerName || typeof parsed.points !== 'number' || !parsed.difficulty) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  save(state: GameState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

