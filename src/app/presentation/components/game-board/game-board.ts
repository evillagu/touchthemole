import { Component, input } from '@angular/core';
import { MoleButton } from '../mole-button/mole-button';

@Component({
  selector: 'app-game-board',
  imports: [MoleButton],
  templateUrl: './game-board.html'
})
export class GameBoard {
  readonly holes = input<ReadonlyArray<number>>([]);
  readonly onHit = input<() => void>(() => {});

  handleHit(): void {
    const handler = this.onHit();
    handler();
  }
}

