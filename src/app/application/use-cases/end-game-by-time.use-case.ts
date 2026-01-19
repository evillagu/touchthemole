import { GameState } from '../../core/domain/game-state.model';

export const endGameByTime = (state: GameState): GameState => {
  return {
    ...state,
    timeRemaining: 0,
  };
};
