import { changeDifficulty } from './change-difficulty.use-case';
import { GameState } from '../../core/domain/game-state.model';
import { Difficulty } from '../../core/domain/difficulty.model';
import { listDifficulties } from './difficulty.use-case';

describe('changeDifficulty', () => {
  const createMockGameState = (difficulty: Difficulty): GameState => ({
    playerName: 'TestPlayer',
    points: 100,
    difficulty
  });

  const difficulties = listDifficulties();

  const testCases = [
    { 
      newDifficulty: difficulties[0], 
      description: 'change to low difficulty' 
    },
    { 
      newDifficulty: difficulties[1], 
      description: 'change to medium difficulty' 
    },
    { 
      newDifficulty: difficulties[2], 
      description: 'change to high difficulty' 
    }
  ];

  testCases.forEach(({ newDifficulty, description }) => {
    it(`should ${description}`, () => {
      const state = createMockGameState(difficulties[0]);
      const result = changeDifficulty(state, newDifficulty);

      expect(result.difficulty).toBe(newDifficulty);
      expect(result.difficulty.id).toBe(newDifficulty.id);
      expect(result.playerName).toBe(state.playerName);
      expect(result.points).toBe(state.points);
    });
  });

  it('should not mutate original state', () => {
    const state = createMockGameState(difficulties[0]);
    const originalDifficulty = state.difficulty;

    changeDifficulty(state, difficulties[1]);

    expect(state.difficulty).toBe(originalDifficulty);
  });

  it('should return new state object', () => {
    const state = createMockGameState(difficulties[0]);
    const result = changeDifficulty(state, difficulties[1]);

    expect(result).not.toBe(state);
  });
});
