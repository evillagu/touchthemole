import { startGame } from './start-game.use-case';
import { GameState } from '../../core/domain/game-state.model';
import { listDifficulties } from './difficulty.use-case';
import { GAME_CONFIG } from './difficulty.use-case';

describe('startGame', () => {
  const difficulties = listDifficulties();

  describe('player name handling', () => {
    const nameTestCases = [
      { playerName: 'TestPlayer', expected: 'TestPlayer', description: 'valid name' },
      { playerName: '  TestPlayer  ', expected: 'TestPlayer', description: 'trimmed name' },
      { playerName: 'A'.repeat(30), expected: 'A'.repeat(24), description: 'truncated long name' },
      { playerName: '   ', expected: 'Jugador', description: 'empty after trim uses default' },
      { playerName: '', expected: 'Jugador', description: 'empty string uses default' }
    ];

    nameTestCases.forEach(({ playerName, expected, description }) => {
      it(`should handle ${description}`, () => {
        const result = startGame(playerName, difficulties[0]);

        expect(result.playerName).toBe(expected);
      });
    });
  });

  describe('points initialization', () => {
    it('should initialize points to 0', () => {
      const result = startGame('TestPlayer', difficulties[0]);

      expect(result.points).toBe(0);
    });

    const difficultyTestCases = [
      { difficulty: difficulties[0], description: 'low difficulty' },
      { difficulty: difficulties[1], description: 'medium difficulty' },
      { difficulty: difficulties[2], description: 'high difficulty' }
    ];

    difficultyTestCases.forEach(({ difficulty, description }) => {
      it(`should initialize points to 0 for ${description}`, () => {
        const result = startGame('TestPlayer', difficulty);

        expect(result.points).toBe(0);
      });
    });
  });

  describe('difficulty assignment', () => {
    const difficultyTestCases = [
      { difficulty: difficulties[0], description: 'low difficulty' },
      { difficulty: difficulties[1], description: 'medium difficulty' },
      { difficulty: difficulties[2], description: 'high difficulty' }
    ];

    difficultyTestCases.forEach(({ difficulty, description }) => {
      it(`should assign ${description}`, () => {
        const result = startGame('TestPlayer', difficulty);

        expect(result.difficulty).toBe(difficulty);
        expect(result.difficulty.id).toBe(difficulty.id);
      });
    });
  });

  describe('name length limit', () => {
    it('should respect maxPlayerNameLength from GAME_CONFIG', () => {
      const longName = 'A'.repeat(GAME_CONFIG.maxPlayerNameLength + 10);
      const result = startGame(longName, difficulties[0]);

      expect(result.playerName.length).toBe(GAME_CONFIG.maxPlayerNameLength);
    });
  });
});
