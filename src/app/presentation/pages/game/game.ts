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
import { endGameByTime } from '../../../application/use-cases/end-game-by-time.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { tickTimer } from '../../../application/use-cases/tick-timer.use-case';
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
  readonly gameConfig = GAME_CONFIG;
  readonly showGameOver = signal<boolean>(false);
  readonly finalScore = signal<number>(0);

  private moleInterval: ReturnType<typeof setInterval> | null = null;
  private moleTimeout: ReturnType<typeof setTimeout> | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private moleCounter = 0;
  private hasActiveHitEffect = signal<boolean>(false);

  constructor() {
    const loadedState = this.repository.load();
    let initialState: GameState;
    if (loadedState) {
      const normalizedDifficulty = resolveDifficulty(loadedState.difficulty.id);
      initialState = {
        ...loadedState,
        difficulty: normalizedDifficulty,
      };
    } else {
      initialState = startGame(GAME_CONFIG.defaultPlayerName, this.difficulties[0]);
    }
    this.gameState = signal<GameState>(initialState);
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
    this.updateState(startGame(current.playerName, current.difficulty, true));
    this.isGameStarted.set(true);
    this.activeMoleIndexes.set([]);
    this.moleCounter = 0;
    this.startMoleMovement();
    if (this.gameState().isTimeBased) {
      this.startTimer();
    }
  }

  onChangePlayer(): void {
    this.stopMoleMovement();
    this.stopTimer();
    this.repository.clear();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.stopMoleMovement();
    this.stopTimer();
  }

  private startMoleMovement(): void {
    this.stopMoleMovement();
    if (!this.isGameStarted()) {
      return;
    }
    this.moveMole();
    this.scheduleNextMoleInterval();
  }

  private scheduleNextMoleInterval(): void {
    if (!this.isGameStarted() || this.moleInterval !== null) {
      return;
    }
    const baseInterval = this.gameState().difficulty.intervalMs;
    const timeRemaining = this.gameState().timeRemaining;
    const interval = this.calculateMoleInterval(baseInterval, timeRemaining);
    this.moleInterval = setInterval(() => {
      this.handleMoleIntervalTick(interval);
    }, interval);
  }

  private handleMoleIntervalTick(originalInterval: number): void {
    if (!this.isGameStarted()) {
      this.stopMoleMovement();
      return;
    }
    const currentBaseInterval = this.gameState().difficulty.intervalMs;
    const currentTimeRemaining = this.gameState().timeRemaining;
    const currentInterval = this.calculateMoleInterval(currentBaseInterval, currentTimeRemaining);
    if (currentInterval !== originalInterval) {
      clearInterval(this.moleInterval!);
      this.moleInterval = null;
      this.scheduleNextMoleInterval();
      return;
    }
    this.moveMole();
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
    if (!this.isGameStarted()) {
      return;
    }

    this.moleCounter++;
    const indexesToShow = this.selectMoleIndexes();
    this.activeMoleIndexes.set(indexesToShow);
    this.scheduleMoleVisibility(indexesToShow);
  }

  private selectMoleIndexes(): number[] {
    if (this.moleCounter % 5 === 0) {
      return this.getTwoRandomIndexes();
    }
    return [this.getRandomIndex()];
  }

  private scheduleMoleVisibility(indexesToShow: number[]): void {
    if (this.moleTimeout !== null) {
      clearTimeout(this.moleTimeout);
    }

    const baseInterval = this.gameState().difficulty.intervalMs;
    const timeRemaining = this.gameState().timeRemaining;
    const interval = this.calculateMoleInterval(baseInterval, timeRemaining);
    const visibilityTime = Math.max(GAME_CONFIG.minVisibilityMs, interval);

    this.moleTimeout = setTimeout(() => {
      this.hideMoleIfStillActive(indexesToShow);
    }, visibilityTime);
  }

  private hideMoleIfStillActive(indexesToShow: number[]): void {
    const currentIndexes = this.activeMoleIndexes();
    if (this.arraysEqual(currentIndexes, indexesToShow)) {
      this.activeMoleIndexes.set([]);
    }
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
      this.processHit(holeIndex);
    };
  }

  private processHit(holeIndex: number): void {
    const currentIndexes = this.activeMoleIndexes();

    if (currentIndexes.includes(holeIndex)) {
      const nextState = applyHit(this.gameState());
      this.updateState(nextState);

      const remainingIndexes = currentIndexes.filter(
        (idx) => idx !== holeIndex
      );
      this.activeMoleIndexes.set(remainingIndexes);

      if (remainingIndexes.length === 0) {
        this.handleAllMolesHit();
      }
    }
  }

  private handleAllMolesHit(): void {
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

  private initializeDifficultyEffect(): void {
    effect(() => {
      void this.gameState().difficulty;
      if (this.isGameStarted()) {
        this.startMoleMovement();
      }
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const currentState = this.gameState();
      if (!currentState.isTimeBased || !currentState.timeRemaining) {
        return;
      }

      const nextState = tickTimer(currentState);
      this.updateState(nextState);

      if (nextState.timeRemaining === 0) {
        this.finishGameByTime();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private finishGameByTime(): void {
    this.stopMoleMovement();
    this.stopTimer();
    const finalState = endGameByTime(this.gameState());
    this.updateState(finalState);
    this.isGameStarted.set(false);
    this.finalScore.set(finalState.points);
    this.showGameOver.set(true);
  }

  onCloseGameOver(): void {
    this.showGameOver.set(false);
  }

  private calculateMoleInterval(baseInterval: number, timeRemaining?: number): number {
    if (!timeRemaining || timeRemaining > GAME_CONFIG.speedIncreaseThreshold) {
      return baseInterval;
    }
    return Math.floor(baseInterval * GAME_CONFIG.fastIntervalMultiplier);
  }

  private updateState(state: GameState): void {
    this.gameState.set(state);
    if (!state.isTimeBased) {
      this.repository.save(state);
    }
  }
}
