import { applyHit } from './apply-hit.use-case';
import { GameState } from '../../core/domain/game-state.model';
import { Difficulty } from '../../core/domain/difficulty.model';
import { listDifficulties } from './difficulty.use-case';

describe('applyHit', () => {
  const createMockGameState = (points: number, difficulty: Difficulty): GameState => ({
    playerName: 'TestPlayer',
    points,
    difficulty
  });

  const difficulties = listDifficulties();

  const testCases = [
    { 
      initialPoints: 0, 
      difficulty: difficulties[0], 
      expectedPoints: 10, 
      description: 'low difficulty adds 10 points' 
    },
    { 
      initialPoints: 50, 
      difficulty: difficulties[1], 
      expectedPoints: 70, 
      description: 'medium difficulty adds 20 points' 
    },
    { 
      initialPoints: 100, 
      difficulty: difficulties[2], 
      expectedPoints: 130, 
      description: 'high difficulty adds 30 points' 
    }
  ];

  testCases.forEach(({ initialPoints, difficulty, expectedPoints, description }) => {
    it(`should ${description}`, () => {
      const state = createMockGameState(initialPoints, difficulty);
      const result = applyHit(state);

      expect(result.points).toBe(expectedPoints);
      expect(result.playerName).toBe(state.playerName);
      expect(result.difficulty).toBe(state.difficulty);
    });
  });

  it('should not mutate original state', () => {
    const state = createMockGameState(0, difficulties[0]);
    const originalPoints = state.points;

    applyHit(state);

    expect(state.points).toBe(originalPoints);
  });

  it('should return new state object', () => {
    const state = createMockGameState(0, difficulties[0]);
    const result = applyHit(state);

    expect(result).not.toBe(state);
  });
});
