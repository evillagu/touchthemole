import { Component, input } from '@angular/core';
import { MoleButtonComponent } from '../mole-button/mole-button';

@Component({
  selector: 'app-game-board',
  imports: [MoleButtonComponent],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
})
export class GameBoardComponent {
  readonly holes = input<readonly number[]>([]);
  readonly onHit = input<((holeIndex: number) => void) | undefined>(undefined);
  readonly activeMoleIndexes = input<number[]>([]);

  handleHit(holeIndex: number): void {
    const activeIndexes = this.activeMoleIndexes();
    if (activeIndexes.includes(holeIndex)) {
      this.onHit()?.(holeIndex);
    }
  }
}
