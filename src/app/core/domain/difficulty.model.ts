export interface Difficulty {
  readonly id: string;
  readonly label: string;
  readonly multiplier: number;
}

export enum DifficultyId {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

