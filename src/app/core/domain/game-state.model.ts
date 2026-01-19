import { Difficulty } from './difficulty.model';

export interface GameState {
  readonly playerName: string;
  readonly points: number;
  readonly difficulty: Difficulty;
  readonly timeRemaining?: number;
  readonly gameDuration?: number;
  readonly isTimeBased?: boolean;
}
