import { GameState } from '../../core/domain/game-state.model';

const calculateTimeBonus = (
  timeRemaining: number | undefined,
  timeBonus: number | undefined
): number | undefined => {
  if (timeRemaining === undefined || timeRemaining === null) {
    return timeRemaining;
  }
  const bonus =
    typeof timeBonus === 'number' && !isNaN(timeBonus) ? timeBonus : 0;
  const current =
    typeof timeRemaining === 'number' && !isNaN(timeRemaining)
      ? timeRemaining
      : 0;
  const calculated = current + bonus;
  return isNaN(calculated) ? timeRemaining : calculated;
};

export const applyHit = (state: GameState): GameState => {
  const newPoints = state.points + state.difficulty.points;
  const newTimeRemaining =
    state.isTimeBased &&
    state.timeRemaining !== undefined &&
    state.timeRemaining !== null
      ? calculateTimeBonus(state.timeRemaining, state.difficulty.timeBonus)
      : state.timeRemaining;

  return {
    ...state,
    points: newPoints,
    timeRemaining: newTimeRemaining,
  };
};
