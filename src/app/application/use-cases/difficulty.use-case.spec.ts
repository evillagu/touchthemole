import {
  listDifficulties,
  resolveDifficulty,
  GAME_CONFIG,
} from './difficulty.use-case';
import { Difficulty, DifficultyId } from '../../core/domain/difficulty.model';

describe('difficulty use cases', () => {
  describe('listDifficulties', () => {
    it('should return all difficulties', () => {
      const difficulties = listDifficulties();

      expect(difficulties.length).toBe(3);
    });

    it('should return difficulties with correct structure', () => {
      const difficulties = listDifficulties();

      difficulties.forEach((difficulty: Difficulty) => {
        expect(difficulty.id).toBeDefined();
        expect(difficulty.label).toBeDefined();
        expect(difficulty.multiplier).toBeDefined();
        expect(difficulty.intervalMs).toBeDefined();
        expect(difficulty.points).toBeDefined();
      });
    });

    describe('difficulty values', () => {
      const expectedDifficulties = [
        { id: DifficultyId.Low, intervalMs: 1000, points: 10 },
        { id: DifficultyId.Medium, intervalMs: 750, points: 20 },
        { id: DifficultyId.High, intervalMs: 500, points: 30 },
      ];

      expectedDifficulties.forEach((expected, index) => {
        it(`should have correct values for ${expected.id} difficulty`, () => {
          const difficulties = listDifficulties();
          const difficulty = difficulties[index];

          expect(difficulty.id).toBe(expected.id);
          expect(difficulty.intervalMs).toBe(expected.intervalMs);
          expect(difficulty.points).toBe(expected.points);
        });
      });
    });

    it('should return readonly array', () => {
      const difficulties = listDifficulties();

      expect(() => {
        (difficulties as Difficulty[]).push({} as Difficulty);
      }).toThrow();
    });
  });

  describe('resolveDifficulty', () => {
    const resolveTestCases = [
      { id: DifficultyId.Low, description: 'low difficulty id' },
      { id: DifficultyId.Medium, description: 'medium difficulty id' },
      { id: DifficultyId.High, description: 'high difficulty id' },
    ];

    describe('valid ids', () => {
      resolveTestCases.forEach(({ id, description }) => {
        it(`should resolve ${description}`, () => {
          const result = resolveDifficulty(id);

          expect(result.id).toBe(id);
        });
      });
    });

    describe('invalid ids', () => {
      it('should return default difficulty for unknown id', () => {
        const result = resolveDifficulty('unknown-id');
        const defaultDifficulty = listDifficulties()[0];

        expect(result.id).toBe(defaultDifficulty.id);
      });

      it('should return default difficulty for empty string', () => {
        const result = resolveDifficulty('');
        const defaultDifficulty = listDifficulties()[0];

        expect(result.id).toBe(defaultDifficulty.id);
      });

      describe('invalid id test cases', () => {
        const invalidIdTestCases = [
          { id: 'invalid', description: 'invalid id' },
          { id: 'unknown', description: 'unknown id' },
          { id: '123', description: 'numeric string' },
        ];

        invalidIdTestCases.forEach(({ id, description }) => {
          it(`should return default difficulty for ${description}`, () => {
            const result = resolveDifficulty(id);
            const defaultDifficulty = listDifficulties()[0];

            expect(result.id).toBe(defaultDifficulty.id);
          });
        });
      });
    });
  });

  describe('GAME_CONFIG', () => {
    it('should have all required properties', () => {
      expect(GAME_CONFIG.minVisibilityMs).toBeDefined();
      expect(GAME_CONFIG.hitDelayMs).toBeDefined();
      expect(GAME_CONFIG.totalHoles).toBeDefined();
      expect(GAME_CONFIG.maxPlayerNameLength).toBeDefined();
      expect(GAME_CONFIG.defaultPlayerName).toBeDefined();
    });

    it('should have correct values', () => {
      expect(GAME_CONFIG.minVisibilityMs).toBe(800);
      expect(GAME_CONFIG.hitDelayMs).toBe(500);
      expect(GAME_CONFIG.totalHoles).toBe(9);
      expect(GAME_CONFIG.maxPlayerNameLength).toBe(24);
      expect(GAME_CONFIG.defaultPlayerName).toBe('Jugador');
    });

    it('should be readonly', () => {
      expect(() => {
        (GAME_CONFIG as { minVisibilityMs: number }).minVisibilityMs = 1000;
      }).toThrow();
    });
  });
});
