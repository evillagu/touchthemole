import {
  Component,
  ViewEncapsulation,
  inject,
  signal,
  WritableSignal,
  effect,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { applyHit } from '../../../application/use-cases/apply-hit.use-case';
import { changeDifficulty } from '../../../application/use-cases/change-difficulty.use-case';
import {
  listDifficulties,
  resolveDifficulty,
  GAME_CONFIG,
} from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { GameState } from '../../../core/domain/game-state.model';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';
import { GameBoardComponent } from '../../components/game-board/game-board';
import { ScoreBoardComponent } from '../../components/score-board/score-board';

@Component({
  selector: 'app-game-page',
  imports: [GameBoardComponent, ScoreBoardComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class GamePageComponent implements OnDestroy {
  readonly difficulties = listDifficulties();
  readonly holes = Array.from(
    { length: GAME_CONFIG.totalHoles },
    (_, index) => index
  );
  readonly gameState: WritableSignal<GameState>;
  readonly handleHit: (holeIndex: number) => void;
  readonly isGameStarted = signal<boolean>(false);
  readonly activeMoleIndexes = signal<number[]>([]);

  private moleInterval: ReturnType<typeof setInterval> | null = null;
  private moleTimeout: ReturnType<typeof setTimeout> | null = null;
  private moleCounter = 0;
  private hasActiveHitEffect = signal<boolean>(false);

  constructor() {
    const loadedState = this.repository.load();
    this.gameState = signal<GameState>(
      loadedState ??
        startGame(GAME_CONFIG.defaultPlayerName, this.difficulties[0])
    );
    this.isGameStarted.set(false);
    this.moleCounter = 0;
    this.handleHit = this.initializeHandleHit();
    this.initializeDifficultyEffect();
  }

  onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const difficulty = resolveDifficulty(
      target?.value ?? this.difficulties[0].id
    );
    this.updateState(changeDifficulty(this.gameState(), difficulty));
  }

  onRestart(): void {
    const current = this.gameState();
    this.updateState(startGame(current.playerName, current.difficulty));
    this.isGameStarted.set(true);
    this.activeMoleIndexes.set([]);
    this.moleCounter = 0;
    this.startMoleMovement();
  }

  onChangePlayer(): void {
    this.stopMoleMovement();
    this.repository.clear();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.stopMoleMovement();
  }

  private startMoleMovement(): void {
    this.stopMoleMovement();
    this.moveMole();
    const interval = this.gameState().difficulty.intervalMs;
    this.moleInterval = setInterval(() => {
      this.moveMole();
    }, interval);
  }

  private stopMoleMovement(): void {
    if (this.moleInterval !== null) {
      clearInterval(this.moleInterval);
      this.moleInterval = null;
    }
    if (this.moleTimeout !== null) {
      clearTimeout(this.moleTimeout);
      this.moleTimeout = null;
    }
    this.activeMoleIndexes.set([]);
    this.moleCounter = 0;
  }

  private moveMole(): void {
    this.moleCounter++;

    let indexesToShow: number[];

    if (this.moleCounter % 5 === 0) {
      indexesToShow = this.getTwoRandomIndexes();
    } else {
      indexesToShow = [this.getRandomIndex()];
    }

    this.activeMoleIndexes.set(indexesToShow);

    if (this.moleTimeout !== null) {
      clearTimeout(this.moleTimeout);
    }

    const interval = this.gameState().difficulty.intervalMs;
    const visibilityTime = Math.max(GAME_CONFIG.minVisibilityMs, interval);

    this.moleTimeout = setTimeout(() => {
      const currentIndexes = this.activeMoleIndexes();
      if (this.arraysEqual(currentIndexes, indexesToShow)) {
        this.activeMoleIndexes.set([]);
      }
    }, visibilityTime);
  }

  private getRandomIndex(): number {
    return Math.floor(Math.random() * this.holes.length);
  }

  private getTwoRandomIndexes(): number[] {
    const firstIndex = this.getRandomIndex();
    let secondIndex = this.getRandomIndex();

    while (secondIndex === firstIndex) {
      secondIndex = this.getRandomIndex();
    }

    return [firstIndex, secondIndex];
  }

  private arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, index) => val === sorted2[index]);
  }

  private readonly router = inject(Router);
  private readonly repository = inject(GAME_STATE_REPOSITORY);

  private initializeHandleHit(): (holeIndex: number) => void {
    return (holeIndex: number): void => {
      const currentIndexes = this.activeMoleIndexes();

      if (currentIndexes.includes(holeIndex)) {
        const nextState = applyHit(this.gameState());
        this.updateState(nextState);

        const remainingIndexes = currentIndexes.filter(
          (idx) => idx !== holeIndex
        );
        this.activeMoleIndexes.set(remainingIndexes);

        if (remainingIndexes.length === 0) {
          this.hasActiveHitEffect.set(true);
          setTimeout(() => {
            this.hasActiveHitEffect.set(false);
          }, GAME_CONFIG.hitEffectDurationMs);

          if (this.moleTimeout !== null) {
            clearTimeout(this.moleTimeout);
            this.moleTimeout = null;
          }

          const delay = this.hasActiveHitEffect()
            ? GAME_CONFIG.hitDelayMsWithEffect
            : GAME_CONFIG.hitDelayMs;

          this.moleTimeout = setTimeout(() => {
            this.moveMole();
          }, delay);
        }
      }
    };
  }

  private initializeDifficultyEffect(): void {
    effect(() => {
      void this.gameState().difficulty;
      if (this.isGameStarted()) {
        this.startMoleMovement();
      }
    });
  }

  private updateState(state: GameState): void {
    this.gameState.set(state);
    this.repository.save(state);
  }
}
