import { Difficulty } from '../../core/domain/difficulty.model';
import { GameState } from '../../core/domain/game-state.model';

export const startGame = (playerName: string, difficulty: Difficulty): GameState => {
  const safeName = playerName.trim().slice(0, 24);
  return {
    playerName: safeName.length ? safeName : 'Jugador',
    points: 0,
    difficulty
  };
};

