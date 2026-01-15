import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { listDifficulties } from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly repository = inject(GAME_STATE_REPOSITORY);
  private readonly defaultDifficulty = listDifficulties()[0];

  readonly nameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  start(): void {
    if (this.nameControl.invalid) {
      return;
    }
    const state = startGame(this.nameControl.value, this.defaultDifficulty);
    this.repository.save(state);
    this.router.navigate(['/game']);
  }
}

