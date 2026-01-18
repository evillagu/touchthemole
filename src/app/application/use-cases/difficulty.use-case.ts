import { Difficulty, DifficultyId } from '../../core/domain/difficulty.model';

const createImmutableArray = <T>(items: readonly T[]): readonly T[] => {
  const frozen = Object.freeze([...items]);
  return new Proxy(frozen, {
    set: () => {
      throw new Error('Cannot modify readonly array');
    },
    deleteProperty: () => {
      throw new Error('Cannot delete from readonly array');
    },
    get: (target, prop) => {
      if (
        typeof prop === 'string' &&
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(
          prop
        )
      ) {
        return () => {
          throw new Error(`Cannot call ${prop} on readonly array`);
        };
      }
      return target[prop as keyof typeof target];
    },
  }) as readonly T[];
};

export const GAME_CONFIG = Object.freeze({
  minVisibilityMs: 800,
  hitDelayMs: 500,
  totalHoles: 9,
  maxPlayerNameLength: 24,
  defaultPlayerName: 'Jugador',
} as const);

const difficultiesData: readonly Difficulty[] = [
  Object.freeze({
    id: DifficultyId.Low,
    label: $localize`:@@difficulty.low:Bajo`,
    multiplier: 1,
    intervalMs: 1000,
    points: 10,
  }),
  Object.freeze({
    id: DifficultyId.Medium,
    label: $localize`:@@difficulty.medium:Medio`,
    multiplier: 2,
    intervalMs: 750,
    points: 20,
  }),
  Object.freeze({
    id: DifficultyId.High,
    label: $localize`:@@difficulty.high:Alto`,
    multiplier: 3,
    intervalMs: 500,
    points: 30,
  }),
];

const difficulties: readonly Difficulty[] = createImmutableArray(difficultiesData);

export const listDifficulties = (): readonly Difficulty[] => difficulties;

export const resolveDifficulty = (id: string): Difficulty => {
  const match = difficulties.find((difficulty) => difficulty.id === id);
  return match ?? difficulties[0];
};
