import { Difficulty } from '../../core/domain/difficulty.model';
import { GameState } from '../../core/domain/game-state.model';
import { GAME_CONFIG } from './difficulty.use-case';

export const startGame = (
  playerName: string,
  difficulty: Difficulty
): GameState => {
  const safeName = playerName.trim().slice(0, GAME_CONFIG.maxPlayerNameLength);
  return {
    playerName: safeName.length
      ? safeName
      : $localize`:@@game.defaultPlayerName:Jugador`,
    points: 0,
    difficulty,
  };
};
