import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { listDifficulties } from '../../../application/use-cases/difficulty.use-case';
import { startGame } from '../../../application/use-cases/start-game.use-case';
import { Difficulty } from '../../../core/domain/difficulty.model';
import { GAME_STATE_REPOSITORY } from '../../../core/ports/game-state-repository.token';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomePage {
  readonly nameControl: FormControl<string>;

  constructor() {
    this.router = inject(Router);
    this.defaultDifficulty = listDifficulties()[0];
    this.nameControl = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    });
  }

  start(): void {
    if (this.nameControl.invalid) {
      return;
    }
    const state = startGame(this.nameControl.value, this.defaultDifficulty);
    this.repository.save(state);
    this.router.navigate(['/game']);
  }

  private readonly router: Router;
  private readonly repository = inject(GAME_STATE_REPOSITORY);
  private readonly defaultDifficulty: Difficulty;
}

