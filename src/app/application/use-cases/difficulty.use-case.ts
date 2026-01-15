import { Difficulty, DifficultyId } from '../../core/domain/difficulty.model';

const difficulties: ReadonlyArray<Difficulty> = [
  { id: DifficultyId.Low, label: 'Bajo', multiplier: 1 },
  { id: DifficultyId.Medium, label: 'Medio', multiplier: 2 },
  { id: DifficultyId.High, label: 'Alto', multiplier: 3 }
];

export const listDifficulties = (): ReadonlyArray<Difficulty> => difficulties;

export const resolveDifficulty = (id: string): Difficulty => {
  const match = difficulties.find((difficulty) => difficulty.id === id);
  return match ?? difficulties[0];
};

