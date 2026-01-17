export interface Difficulty {
  readonly id: string;
  readonly label: string;
  readonly multiplier: number;
  readonly intervalMs: number;
  readonly points: number;
}

export enum DifficultyId {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

