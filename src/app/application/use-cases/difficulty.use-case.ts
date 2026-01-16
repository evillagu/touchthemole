import { Difficulty, DifficultyId } from '../../core/domain/difficulty.model';

const difficulties: readonly Difficulty[] = [
  { id: DifficultyId.Low, label: $localize`:@@difficulty.low:Bajo`, multiplier: 1 },
  { id: DifficultyId.Medium, label: $localize`:@@difficulty.medium:Medio`, multiplier: 2 },
  { id: DifficultyId.High, label: $localize`:@@difficulty.high:Alto`, multiplier: 3 }
];

export const listDifficulties = (): readonly Difficulty[] => difficulties;

export const resolveDifficulty = (id: string): Difficulty => {
  const match = difficulties.find((difficulty) => difficulty.id === id);
  return match ?? difficulties[0];
};

