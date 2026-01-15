import { Component, output } from '@angular/core';

@Component({
  selector: 'app-mole-button',
  templateUrl: './mole-button.html'
})
export class MoleButton {
  readonly hit = output<void>();
}

