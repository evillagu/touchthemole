import { LocalStorageGameStateAdapter } from './local-storage-game-state.adapter';
import { GameState } from '../../core/domain/game-state.model';
import { Difficulty } from '../../core/domain/difficulty.model';
import { listDifficulties } from '../../application/use-cases/difficulty.use-case';

describe('LocalStorageGameStateAdapter', () => {
  let adapter: LocalStorageGameStateAdapter;
  const storageKey = 'touch-the-mole:game-state';

  const createMockGameState = (playerName: string, points: number): GameState => {
    const difficulties = listDifficulties();
    return {
      playerName,
      points,
      difficulty: difficulties[0]
    };
  };

  beforeEach(() => {
    adapter = new LocalStorageGameStateAdapter();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save', () => {
    const saveTestCases = [
      { playerName: 'Player1', points: 0, description: 'initial state' },
      { playerName: 'Player2', points: 100, description: 'state with points' },
      { playerName: 'Test Player', points: 500, description: 'state with spaces in name' }
    ];

    saveTestCases.forEach(({ playerName, points, description }) => {
      it(`should save game state ${description}`, () => {
        const state = createMockGameState(playerName, points);
        adapter.save(state);

        const saved = localStorage.getItem(storageKey);
        expect(saved).toBeTruthy();

        const parsed = JSON.parse(saved as string);
        expect(parsed.playerName).toBe(playerName);
        expect(parsed.points).toBe(points);
      });
    });

    it('should overwrite existing state', () => {
      const state1 = createMockGameState('Player1', 100);
      const state2 = createMockGameState('Player2', 200);

      adapter.save(state1);
      adapter.save(state2);

      const loaded = adapter.load();
      expect(loaded?.playerName).toBe('Player2');
      expect(loaded?.points).toBe(200);
    });
  });

  describe('load', () => {
    const loadTestCases = [
      { playerName: 'Player1', points: 0, description: 'valid state' },
      { playerName: 'Player2', points: 100, description: 'state with points' }
    ];

    loadTestCases.forEach(({ playerName, points, description }) => {
      it(`should load ${description}`, () => {
        const state = createMockGameState(playerName, points);
        adapter.save(state);

        const loaded = adapter.load();

        expect(loaded).toBeTruthy();
        expect(loaded?.playerName).toBe(playerName);
        expect(loaded?.points).toBe(points);
        expect(loaded?.difficulty).toBeDefined();
      });
    });

    it('should return null when localStorage is empty', () => {
      const loaded = adapter.load();

      expect(loaded).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem(storageKey, 'invalid-json');

      const loaded = adapter.load();

      expect(loaded).toBeNull();
    });

    const invalidStateTestCases = [
      { state: {}, description: 'empty object' },
      { state: { playerName: 'Test' }, description: 'missing points' },
      { state: { points: 100 }, description: 'missing playerName' },
      { state: { playerName: 'Test', points: 'invalid' }, description: 'invalid points type' },
      { state: { playerName: 'Test', points: 100 }, description: 'missing difficulty' }
    ];

    invalidStateTestCases.forEach(({ state, description }) => {
      it(`should return null for ${description}`, () => {
        localStorage.setItem(storageKey, JSON.stringify(state));

        const loaded = adapter.load();

        expect(loaded).toBeNull();
      });
    });
  });

  describe('clear', () => {
    it('should remove state from localStorage', () => {
      const state = createMockGameState('Player1', 100);
      adapter.save(state);

      adapter.clear();

      const loaded = adapter.load();
      expect(loaded).toBeNull();
      expect(localStorage.getItem(storageKey)).toBeNull();
    });

    it('should not throw when clearing empty storage', () => {
      expect(() => adapter.clear()).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should save and load complete game state', () => {
      const difficulties = listDifficulties();
      const state: GameState = {
        playerName: 'TestPlayer',
        points: 150,
        difficulty: difficulties[2]
      };

      adapter.save(state);
      const loaded = adapter.load();

      expect(loaded).toEqual(state);
      expect(loaded?.playerName).toBe(state.playerName);
      expect(loaded?.points).toBe(state.points);
      expect(loaded?.difficulty.id).toBe(state.difficulty.id);
    });
  });
});
