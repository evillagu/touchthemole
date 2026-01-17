import { Difficulty, DifficultyId } from '../../core/domain/difficulty.model';

export const GAME_CONFIG = {
  minVisibilityMs: 800,
  hitDelayMs: 500,
  totalHoles: 9,
  maxPlayerNameLength: 24,
  defaultPlayerName: 'Jugador'
} as const;

const difficulties: readonly Difficulty[] = [
  { 
    id: DifficultyId.Low, 
    label: $localize`:@@difficulty.low:Bajo`, 
    multiplier: 1,
    intervalMs: 1000,
    points: 10
  },
  { 
    id: DifficultyId.Medium, 
    label: $localize`:@@difficulty.medium:Medio`, 
    multiplier: 2,
    intervalMs: 750,
    points: 20
  },
  { 
    id: DifficultyId.High, 
    label: $localize`:@@difficulty.high:Alto`, 
    multiplier: 3,
    intervalMs: 500,
    points: 30
  }
];

export const listDifficulties = (): readonly Difficulty[] => difficulties;

export const resolveDifficulty = (id: string): Difficulty => {
  const match = difficulties.find((difficulty) => difficulty.id === id);
  return match ?? difficulties[0];
};

