import { GameState } from '../../core/domain/game-state.model';

export const applyHit = (state: GameState): GameState => {
  const newPoints = state.points + state.difficulty.points;

  let newTimeRemaining = state.timeRemaining;

  if (state.isTimeBased && state.timeRemaining !== undefined && state.timeRemaining !== null) {
    const bonusTime = typeof state.difficulty.timeBonus === 'number' && !isNaN(state.difficulty.timeBonus) 
      ? state.difficulty.timeBonus 
      : 0;
    const currentTime = typeof state.timeRemaining === 'number' && !isNaN(state.timeRemaining) 
      ? state.timeRemaining 
      : 0;
    const calculatedTime = currentTime + bonusTime;
    newTimeRemaining = isNaN(calculatedTime) ? state.timeRemaining : calculatedTime;
  }

  return {
    ...state,
    points: newPoints,
    timeRemaining: newTimeRemaining,
  };
};
