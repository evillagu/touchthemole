import { Component, input } from '@angular/core';
import { MoleButtonComponent } from '../mole-button/mole-button';

@Component({
  selector: 'app-game-board',
  imports: [MoleButtonComponent],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss'
})
export class GameBoardComponent {
  readonly holes = input<readonly number[]>([]);
  readonly onHit = input<(() => void) | undefined>(undefined);
  readonly activeMoleIndex = input<number | null>(null);

  handleHit(holeIndex: number): void {
    if (this.activeMoleIndex() === holeIndex) {
      this.onHit()?.();
    }
  }
}

