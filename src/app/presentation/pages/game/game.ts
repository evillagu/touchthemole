import { Component, ViewEncapsulation, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { applyHit } from '../../../application/use-cases/apply-hit.use-case';
import { changeDifficulty } from '../../../application/use-cases/change-difficulty.use-case';
import { listDifficulties, resolveDifficulty } from '../../../application/use-cases/difficulty.use-case';
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
  encapsulation: ViewEncapsulation.None
})
export class GamePageComponent {
  readonly difficulties = listDifficulties();
  readonly holes = Array.from({ length: 9 }, (_, index) => index);
  readonly gameState: WritableSignal<GameState>;
  readonly handleHit: () => void;

  constructor() {
    this.gameState = signal<GameState>(
      this.repository.load() ?? startGame('Jugador', this.difficulties[0])
    );
    this.handleHit = (): void => {
      const nextState = applyHit(this.gameState());
      this.updateState(nextState);
    };
  }

  onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const difficulty = resolveDifficulty(target?.value ?? this.difficulties[0].id);
    this.updateState(changeDifficulty(this.gameState(), difficulty));
  }

  onRestart(): void {
    const current = this.gameState();
    this.updateState(startGame(current.playerName, current.difficulty));
  }

  onChangePlayer(): void {
    this.repository.clear();
    this.router.navigate(['/home']);
  }

  private readonly router = inject(Router);
  private readonly repository = inject(GAME_STATE_REPOSITORY);

  private updateState(state: GameState): void {
    this.gameState.set(state);
    this.repository.save(state);
  }
}

