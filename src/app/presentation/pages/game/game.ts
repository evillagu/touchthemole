import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { applyHit } from '../../../application/use-cases/apply-hit.use-case';
import { changeDifficulty } from '../../../application/use-cases/change-difficulty.use-case';
import { listDifficulties, resolveDifficulty } from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { GameState } from '../../../core/domain/game-state.model';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';
import { GameBoard } from '../../components/game-board/game-board';
import { ScoreBoard } from '../../components/score-board/score-board';

@Component({
  selector: 'app-game-page',
  imports: [GameBoard, ScoreBoard],
  templateUrl: './game.html',
  styleUrl: './game.scss',
  encapsulation: ViewEncapsulation.None
})
export class GamePage {
  private readonly repository = inject(GAME_STATE_REPOSITORY);
  readonly difficulties = listDifficulties();
  readonly holes = Array.from({ length: 9 }, (_, index) => index);
  readonly gameState = signal<GameState>(
    this.repository.load() ?? startGame('Jugador', this.difficulties[0])
  );

  readonly handleHit = (): void => {
    const nextState = applyHit(this.gameState());
    this.updateState(nextState);
  };

  onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const difficulty = resolveDifficulty(target?.value ?? this.difficulties[0].id);
    this.updateState(changeDifficulty(this.gameState(), difficulty));
  }

  onRestart(): void {
    const current = this.gameState();
    this.updateState(startGame(current.playerName, current.difficulty));
  }

  private updateState(state: GameState): void {
    this.gameState.set(state);
    this.repository.save(state);
  }
}

