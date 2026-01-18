import { GameState } from '../../core/domain/game-state.model';

export const applyHit = (state: GameState): GameState => ({
  ...state,
  points: state.points + state.difficulty.points
});

