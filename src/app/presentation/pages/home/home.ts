import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { listDifficulties } from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { Difficulty } from '../../../core/domain/difficulty.model';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePageComponent {
  readonly form: FormGroup<{
    playerName: FormControl<string>;
  }>;

  constructor() {
    this.router = inject(Router);
    this.defaultDifficulty = listDifficulties()[0];
    this.form = new FormGroup({
      playerName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          (control) => {
            const value = control.value;
            if (typeof value === 'string' && value.trim().length === 0) {
              return { whitespace: true };
            }
            return null;
          },
        ],
      }),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const playerName = this.form.controls.playerName.value;
    const state = startGame(playerName, this.defaultDifficulty);
    this.repository.save(state);
    this.router.navigate(['/game']);
  }

  private readonly router: Router;
  private readonly repository = inject(GAME_STATE_REPOSITORY);
  private readonly defaultDifficulty: Difficulty;
}
