import { Difficulty } from '../../core/domain/difficulty.model';
import { GameState } from '../../core/domain/game-state.model';

export const changeDifficulty = (state: GameState, difficulty: Difficulty): GameState => ({
  ...state,
  difficulty
});

