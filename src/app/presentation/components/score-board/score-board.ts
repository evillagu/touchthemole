import { Component, input } from '@angular/core';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.html',
  styleUrl: './score-board.scss'
})
export class ScoreBoardComponent {
  readonly playerName = input<string>('');
  readonly points = input<number>(0);
}


