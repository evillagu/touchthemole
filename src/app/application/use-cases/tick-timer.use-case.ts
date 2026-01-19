import { GameState } from '../../core/domain/game-state.model';

export const tickTimer = (state: GameState): GameState => {
  if (!state.isTimeBased || !state.timeRemaining || state.timeRemaining <= 0) {
    return state;
  }
  return {
    ...state,
    timeRemaining: state.timeRemaining - 1,
  };
};
