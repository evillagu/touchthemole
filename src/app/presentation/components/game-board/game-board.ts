import { Component, input } from '@angular/core';
import { MoleButtonComponent } from '../mole-button/mole-button';

@Component({
  selector: 'app-game-board',
  imports: [MoleButtonComponent],
  templateUrl: './game-board.html'
})
export class GameBoardComponent {
  readonly holes = input<readonly number[]>([]);
  readonly onHit = input<(() => void) | undefined>(undefined);

  handleHit(): void {
    this.onHit()?.();
  }
}

